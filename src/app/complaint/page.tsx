'use client';

import { useState } from 'react';

// --- DELETED ---
// We have removed the imports for Header, Footer, Banner, and NewsTicker
// because they are now handled by the main layout file (src/app/layout.tsx).

export default function ComplaintPage() {
  const [complaintText, setComplaintText] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [agreed, setAgreed] = useState(false);

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
    'شمال سيناء', 'جنوب سيناء'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 10) {
      alert('يمكن رفع 10 ملفات كحد أقصى');
      return;
    }
    setFiles(selectedFiles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !complaintText || !type || !governorate || !agreed) {
      alert('يرجى ملء جميع الحقول المطلوبة والموافقة على الشروط');
      return;
    }
    console.log({ title, complaintText, type, governorate, files, agreed });
    alert('تم إرسال الشكوى بنجاح');
  };

  // The return statement now only contains the unique content for this page.
  return (
    <div className="container-fluid py-5" style={{backgroundColor: '#f8f9fa'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header text-center py-4" style={{backgroundColor: '#004705'}}>
                <h2 className="fw-bold mb-0 text-white">إنشاء شكوى جديدة</h2>
                <p className="text-white-50 mb-0 mt-2">قدم شكواك وسنقوم بإيصالها للنائب المختص</p>
              </div>
              
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  {/* عنوان الشكوى */}
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{color: '#004705'}}>
                      عنوان الشكوى <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="اكتب عنوان مختصر للشكوى"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      style={{fontSize: '0.9rem'}}
                    />
                  </div>

                  {/* نوع الشكوى */}
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{color: '#004705'}}>
                      نوع الشكوى <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select form-select-lg"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                      style={{fontSize: '0.9rem'}}
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
                      المحافظة <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select form-select-lg"
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      required
                      style={{fontSize: '0.9rem'}}
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
                      style={{fontSize: '0.9rem', resize: 'vertical'}}
                    />
                    <div className="text-end mt-2">
                      <small className="text-muted" style={{fontSize: '0.8rem'}}>
                        {remainingChars} حرف متبقي من {maxLength}
                      </small>
                    </div>
                  </div>

                  {/* رفع المستندات */}
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{color: '#004705'}}>
                      المستندات المرفقة (اختياري)
                    </label>
                    <input
                      type="file"
                      className="form-control form-control-lg"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      onChange={handleFileChange}
                      style={{fontSize: '0.9rem'}}
                    />
                    <small className="text-muted mt-2 d-block">
                      يمكن رفع حتى 10 ملفات (PDF, Word, صور) - الحد الأقصى 5 ميجا لكل ملف
                    </small>
                    {files && files.length > 0 && (
                      <div className="mt-2">
                        <small className="text-success">
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
                      />
                      <label className="form-check-label" htmlFor="agreementCheck" style={{fontSize: '0.9rem'}}>
                        <span className="text-danger">*</span> أفوض إدارة موقع نائبك بإسناد الشكوى إلى من تراه مناسباً من السادة النواب أو المرشحين في أحد المجلسين (النواب أو الشيوخ) كما أنني أوافق على إرسال المستندات إلى من يهمه الأمر
                      </label>
                    </div>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg me-md-2"
                      onClick={() => window.history.back()}
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="btn btn-lg text-white"
                      style={{backgroundColor: '#004705'}}
                      disabled={!agreed}
                    >
                      إرسال الشكوى
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
