'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ComplaintPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [title, setTitle] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [type, setType] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const maxLength = 1500;
  const remainingChars = maxLength - complaintText.length;

  const complaintTypes = [
    'تعليم', 'صحة', 'بيئة', 'محليات', 'فساد', 'مواصلات',
    'كهرباء', 'مياه', 'إسكان', 'عمل', 'أخرى'
  ];

  const governorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'القليوبية',
    'كفر الشيخ', 'الغربية', 'المنوفية', 'البحيرة', 'الإسماعيلية', 'بورسعيد',
    'السويس', 'المنيا', 'بني سويف', 'الفيوم', 'أسيوط', 'سوهاج', 'قنا',
    'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد', 'مطروح',
    'شمال سيناء', 'جنوب سيناء', 'دمياط'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 10) {
      setError('يمكن رفع 10 ملفات كحد أقصى');
      return;
    }
    
    // Check file sizes
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        if (selectedFiles[i].size > 5 * 1024 * 1024) { // 5MB
          setError('حجم الملف يجب أن لا يتجاوز 5 ميجا');
          return;
        }
      }
    }
    
    setFiles(selectedFiles);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title || !complaintText || !type || !governorate || !agreed) {
      setError('يرجى ملء جميع الحقول المطلوبة والموافقة على الشروط');
      return;
    }

    setIsLoading(true);

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('يجب تسجيل الدخول أولاً لتقديم شكوى');
        setIsLoading(false);
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      // Upload files to Supabase Storage if any
      let uploadedFiles: string[] = [];
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}_${i}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('complaints')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
          } else {
            uploadedFiles.push(fileName);
          }
        }
      }

      // Insert complaint into database
      const { data, error: insertError } = await supabase
        .from('issues')
        .insert({
          user_id: user.id,
          title: title,
          description: complaintText,
          category: type,
          governorate: governorate,
          status: 'pending',
          attachments: uploadedFiles.length > 0 ? uploadedFiles : null
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Success
      alert('تم إرسال الشكوى بنجاح! سيتم مراجعتها وإسنادها للنائب المختص.');
      
      // Reset form
      setTitle('');
      setComplaintText('');
      setType('');
      setGovernorate('');
      setFiles(null);
      setAgreed(false);
      
      // Redirect to citizen dashboard
      setTimeout(() => router.push('/citizen/dashboard'), 2000);
      
    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      setError('حدث خطأ أثناء إرسال الشكوى. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5" style={{backgroundColor: '#f8f9fa'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header text-center py-4" style={{backgroundColor: '#004705'}}>
                <h2 className="fw-bold mb-0 text-white">
                  <i className="fas fa-file-alt me-2"></i>
                  إنشاء شكوى جديدة
                </h2>
                <p className="text-white-50 mb-0 mt-2">قدم شكواك وسنقوم بإيصالها للنائب المختص</p>
              </div>
              
              <div className="card-body p-5">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* عنوان الشكوى */}
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{color: '#004705'}}>
                      <i className="fas fa-heading me-2"></i>
                      عنوان الشكوى <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="اكتب عنوان مختصر للشكوى"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* نوع الشكوى */}
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{color: '#004705'}}>
                      <i className="fas fa-tags me-2"></i>
                      نوع الشكوى <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select form-select-lg"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                      disabled={isLoading}
                    >
                      <option value="">اختر نوع الشكوى</option>
                      {complaintTypes.map((complaintType) => (
                        <option key={complaintType} value={complaintType}>
                          {complaintType}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* المحافظة */}
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{color: '#004705'}}>
                      <i className="fas fa-map-marker-alt me-2"></i>
                      المحافظة <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select form-select-lg"
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      required
                      disabled={isLoading}
                    >
                      <option value="">اختر المحافظة</option>
                      {governorates.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* نص الشكوى */}
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{color: '#004705'}}>
                      <i className="fas fa-align-left me-2"></i>
                      تفاصيل الشكوى <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={8}
                      placeholder="اكتب تفاصيل شكواك هنا..."
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                      maxLength={maxLength}
                      required
                      disabled={isLoading}
                      style={{resize: 'vertical'}}
                    />
                    <div className="text-end mt-2">
                      <small className={remainingChars < 100 ? 'text-danger' : 'text-muted'}>
                        {remainingChars} حرف متبقي من {maxLength}
                      </small>
                    </div>
                  </div>

                  {/* رفع المستندات */}
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{color: '#004705'}}>
                      <i className="fas fa-paperclip me-2"></i>
                      المستندات المرفقة (اختياري)
                    </label>
                    <input
                      type="file"
                      className="form-control form-control-lg"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />
                    <small className="text-muted mt-2 d-block">
                      يمكن رفع حتى 10 ملفات (PDF, Word, صور) - الحد الأقصى 5 ميجا لكل ملف
                    </small>
                    {files && files.length > 0 && (
                      <div className="mt-2">
                        <small className="text-success">
                          <i className="fas fa-check-circle me-1"></i>
                          تم اختيار {files.length} ملف
                        </small>
                      </div>
                    )}
                  </div>

                  {/* checkbox الموافقة */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="agreementCheck"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                        disabled={isLoading}
                      />
                      <label className="form-check-label" htmlFor="agreementCheck">
                        <span className="text-danger">*</span> أفوض إدارة موقع نائبك بإسناد الشكوى إلى من تراه مناسباً من السادة النواب أو المرشحين في أحد المجلسين (النواب أو الشيوخ) كما أنني أوافق على إرسال المستندات إلى من يهمه الأمر
                      </label>
                    </div>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg me-md-2"
                      onClick={() => router.back()}
                      disabled={isLoading}
                    >
                      <i className="fas fa-times me-2"></i>
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="btn btn-lg text-white"
                      style={{backgroundColor: '#004705'}}
                      disabled={!agreed || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          إرسال الشكوى
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
