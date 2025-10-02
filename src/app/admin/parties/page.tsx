'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Party {
  id: number;
  name: string;
  name_en: string;
  founded_year?: number;
  description?: string;
  logo_url?: string;
  members_count?: number;
  candidates_count?: number;
  created_at: string;
}

export default function AdminPartiesPage() {
  const supabase = createClientComponentClient();
  const [parties, setParties] = useState<Party[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    founded_year: '',
    description: ''
  });

  useEffect(() => {
    loadParties();
  }, []);

  const loadParties = async () => {
    try {
      const { data, error } = await supabase
        .from('parties')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Load counts for each party
      const partiesWithCounts = await Promise.all(
        (data || []).map(async (party) => {
          const { count: membersCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('user_type', 'member')
            .eq('party', party.name);

          const { count: candidatesCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('user_type', 'candidate')
            .eq('party', party.name);

          return {
            ...party,
            members_count: membersCount || 0,
            candidates_count: candidatesCount || 0
          };
        })
      );

      setParties(partiesWithCounts);
    } catch (error) {
      console.error('Error loading parties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSave = {
        name: formData.name,
        name_en: formData.name_en,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
        description: formData.description || null
      };

      if (editingId) {
        const { error } = await supabase
          .from('parties')
          .update(dataToSave)
          .eq('id', editingId);

        if (error) throw error;
        alert('تم تحديث الحزب بنجاح');
      } else {
        const { error } = await supabase
          .from('parties')
          .insert([dataToSave]);

        if (error) throw error;
        alert('تم إضافة الحزب بنجاح');
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', name_en: '', founded_year: '', description: '' });
      loadParties();
    } catch (error) {
      console.error('Error saving party:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const handleEdit = (party: Party) => {
    setEditingId(party.id);
    setFormData({
      name: party.name,
      name_en: party.name_en || '',
      founded_year: party.founded_year?.toString() || '',
      description: party.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحزب؟')) return;

    try {
      const { error } = await supabase
        .from('parties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setParties(parties.filter(p => p.id !== id));
      alert('تم حذف الحزب بنجاح');
    } catch (error) {
      console.error('Error deleting party:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const initializeParties = async () => {
    if (!confirm('هل تريد إضافة الأحزاب الـ 16 الافتراضية؟ سيتم حذف البيانات الموجودة.')) return;

    const defaultParties = [
      { name: 'مستقبل وطن', name_en: 'Future of a Nation', founded_year: 2014, description: 'حزب سياسي مصري' },
      { name: 'الوفد', name_en: 'Al-Wafd', founded_year: 1919, description: 'أقدم حزب سياسي في مصر' },
      { name: 'التجمع', name_en: 'Al-Tagammu', founded_year: 1976, description: 'حزب التجمع الوطني التقدمي الوحدوي' },
      { name: 'المصريين الأحرار', name_en: 'Free Egyptians', founded_year: 2011, description: 'حزب ليبرالي مصري' },
      { name: 'الشعب الجمهوري', name_en: 'Republican People', founded_year: 2012, description: 'حزب سياسي مصري' },
      { name: 'الإصلاح والتنمية', name_en: 'Reform and Development', founded_year: 2009, description: 'حزب سياسي مصري' },
      { name: 'المحافظين', name_en: 'Conservatives', founded_year: 2006, description: 'حزب المحافظين المصري' },
      { name: 'الحرية المصري', name_en: 'Egyptian Freedom', founded_year: 2011, description: 'حزب سياسي مصري' },
      { name: 'الديمقراطي الاجتماعي', name_en: 'Social Democratic', founded_year: 2011, description: 'حزب الديمقراطية الاجتماعية' },
      { name: 'العدل', name_en: 'Justice', founded_year: 2011, description: 'حزب العدل المصري' },
      { name: 'الجيل الديمقراطي', name_en: 'Democratic Generation', founded_year: 2002, description: 'حزب الجيل الديمقراطي' },
      { name: 'المصري الديمقراطي الاجتماعي', name_en: 'Egyptian Social Democratic', founded_year: 2011, description: 'حزب سياسي مصري' },
      { name: 'الوطن', name_en: 'Al-Watan', founded_year: 2013, description: 'حزب الوطن المصري' },
      { name: 'حماة الوطن', name_en: 'Homeland Defenders', founded_year: 2014, description: 'حزب حماة الوطن' },
      { name: 'مصر الحديثة', name_en: 'Modern Egypt', founded_year: 2011, description: 'حزب مصر الحديثة' },
      { name: 'مستقل', name_en: 'Independent', founded_year: null, description: 'للمرشحين المستقلين' }
    ];

    try {
      await supabase.from('parties').delete().neq('id', 0);
      
      const { error } = await supabase
        .from('parties')
        .insert(defaultParties);

      if (error) throw error;
      
      alert('تم إضافة الأحزاب الـ 16 بنجاح');
      loadParties();
    } catch (error) {
      console.error('Error initializing parties:', error);
      alert('حدث خطأ أثناء الإضافة');
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold" style={{color: '#004705'}}>
            <i className="fas fa-flag me-2"></i>
            إدارة الأحزاب
          </h2>
          <p className="text-muted">إدارة الأحزاب السياسية المصرية</p>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-warning me-2"
            onClick={initializeParties}
          >
            <i className="fas fa-database me-2"></i>
            إضافة الأحزاب الافتراضية
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', name_en: '', founded_year: '', description: '' });
              setShowModal(true);
            }}
          >
            <i className="fas fa-plus me-2"></i>
            إضافة حزب
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">عدد الأحزاب</h6>
              <h3 className="fw-bold text-success">{parties.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">إجمالي النواب</h6>
              <h3 className="fw-bold text-primary">
                {parties.reduce((sum, p) => sum + (p.members_count || 0), 0)}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">إجمالي المرشحين</h6>
              <h3 className="fw-bold text-info">
                {parties.reduce((sum, p) => sum + (p.candidates_count || 0), 0)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Parties Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>الاسم بالعربية</th>
                  <th>الاسم بالإنجليزية</th>
                  <th>سنة التأسيس</th>
                  <th>الوصف</th>
                  <th>النواب</th>
                  <th>المرشحين</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {parties.map(party => (
                  <tr key={party.id}>
                    <td>{party.id}</td>
                    <td><strong>{party.name}</strong></td>
                    <td>{party.name_en}</td>
                    <td>{party.founded_year || '-'}</td>
                    <td>
                      <small>{party.description ? party.description.substring(0, 50) + '...' : '-'}</small>
                    </td>
                    <td>
                      <span className="badge bg-primary">{party.members_count || 0}</span>
                    </td>
                    <td>
                      <span className="badge bg-info">{party.candidates_count || 0}</span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(party)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(party.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingId ? 'تعديل حزب' : 'إضافة حزب جديد'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">الاسم بالعربية *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">الاسم بالإنجليزية</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name_en}
                      onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">سنة التأسيس</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.founded_year}
                      onChange={(e) => setFormData({...formData, founded_year: e.target.value})}
                      min="1900"
                      max="2025"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">الوصف</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="btn btn-success">
                    حفظ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
