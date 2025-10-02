'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Governorate {
  id: number;
  name: string;
  name_en: string;
  population?: number;
  area?: number;
  districts_count?: number;
  members_count?: number;
  candidates_count?: number;
  created_at: string;
}

export default function AdminGovernoratesPage() {
  const supabase = createClientComponentClient();
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    population: '',
    area: '',
    districts_count: ''
  });

  useEffect(() => {
    loadGovernorates();
  }, []);

  const loadGovernorates = async () => {
    try {
      // Load governorates with counts
      const { data, error } = await supabase
        .from('governorates')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Load counts for each governorate
      const governoratesWithCounts = await Promise.all(
        (data || []).map(async (gov) => {
          const { count: membersCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('user_type', 'member')
            .eq('governorate', gov.name);

          const { count: candidatesCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('user_type', 'candidate')
            .eq('governorate', gov.name);

          return {
            ...gov,
            members_count: membersCount || 0,
            candidates_count: candidatesCount || 0
          };
        })
      );

      setGovernorates(governoratesWithCounts);
    } catch (error) {
      console.error('Error loading governorates:', error);
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
        population: formData.population ? parseInt(formData.population) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        districts_count: formData.districts_count ? parseInt(formData.districts_count) : null
      };

      if (editingId) {
        // Update
        const { error } = await supabase
          .from('governorates')
          .update(dataToSave)
          .eq('id', editingId);

        if (error) throw error;
        alert('تم تحديث المحافظة بنجاح');
      } else {
        // Insert
        const { error } = await supabase
          .from('governorates')
          .insert([dataToSave]);

        if (error) throw error;
        alert('تم إضافة المحافظة بنجاح');
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', name_en: '', population: '', area: '', districts_count: '' });
      loadGovernorates();
    } catch (error) {
      console.error('Error saving governorate:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const handleEdit = (gov: Governorate) => {
    setEditingId(gov.id);
    setFormData({
      name: gov.name,
      name_en: gov.name_en || '',
      population: gov.population?.toString() || '',
      area: gov.area?.toString() || '',
      districts_count: gov.districts_count?.toString() || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المحافظة؟')) return;

    try {
      const { error } = await supabase
        .from('governorates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setGovernorates(governorates.filter(g => g.id !== id));
      alert('تم حذف المحافظة بنجاح');
    } catch (error) {
      console.error('Error deleting governorate:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const initializeGovernorates = async () => {
    if (!confirm('هل تريد إضافة المحافظات الـ 27 الافتراضية؟ سيتم حذف البيانات الموجودة.')) return;

    const defaultGovernorates = [
      { name: 'القاهرة', name_en: 'Cairo', population: 10100166, area: 3085.1, districts_count: 15 },
      { name: 'الجيزة', name_en: 'Giza', population: 9200000, area: 85153, districts_count: 12 },
      { name: 'الإسكندرية', name_en: 'Alexandria', population: 5381000, area: 2300, districts_count: 9 },
      { name: 'الدقهلية', name_en: 'Dakahlia', population: 6492000, area: 3538, districts_count: 18 },
      { name: 'الشرقية', name_en: 'Sharqia', population: 7163000, area: 4911, districts_count: 20 },
      { name: 'القليوبية', name_en: 'Qalyubia', population: 5627000, area: 1124, districts_count: 10 },
      { name: 'كفر الشيخ', name_en: 'Kafr El Sheikh', population: 3362000, area: 3437, districts_count: 10 },
      { name: 'الغربية', name_en: 'Gharbia', population: 5164000, area: 1942, districts_count: 8 },
      { name: 'المنوفية', name_en: 'Monufia', population: 4301000, area: 1532, districts_count: 9 },
      { name: 'البحيرة', name_en: 'Beheira', population: 6171000, area: 9826, districts_count: 16 },
      { name: 'الإسماعيلية', name_en: 'Ismailia', population: 1303000, area: 5067, districts_count: 7 },
      { name: 'بورسعيد', name_en: 'Port Said', population: 749000, area: 1345, districts_count: 5 },
      { name: 'السويس', name_en: 'Suez', population: 744000, area: 9002, districts_count: 5 },
      { name: 'المنيا', name_en: 'Minya', population: 5497000, area: 32279, districts_count: 9 },
      { name: 'بني سويف', name_en: 'Beni Suef', population: 3154000, area: 10954, districts_count: 7 },
      { name: 'الفيوم', name_en: 'Fayoum', population: 3747000, area: 6068, districts_count: 6 },
      { name: 'أسيوط', name_en: 'Asyut', population: 4383000, area: 25926, districts_count: 11 },
      { name: 'سوهاج', name_en: 'Sohag', population: 5127000, area: 11022, districts_count: 13 },
      { name: 'قنا', name_en: 'Qena', population: 3164000, area: 10798, districts_count: 9 },
      { name: 'الأقصر', name_en: 'Luxor', population: 1250000, area: 2960, districts_count: 7 },
      { name: 'أسوان', name_en: 'Aswan', population: 1473000, area: 62726, districts_count: 11 },
      { name: 'البحر الأحمر', name_en: 'Red Sea', population: 360000, area: 119099, districts_count: 7 },
      { name: 'الوادي الجديد', name_en: 'New Valley', population: 241000, area: 376505, districts_count: 5 },
      { name: 'مطروح', name_en: 'Matrouh', population: 450000, area: 212112, districts_count: 8 },
      { name: 'شمال سيناء', name_en: 'North Sinai', population: 450000, area: 27564, districts_count: 6 },
      { name: 'جنوب سيناء', name_en: 'South Sinai', population: 102000, area: 31272, districts_count: 9 },
      { name: 'دمياط', name_en: 'Damietta', population: 1496000, area: 910, districts_count: 5 }
    ];

    try {
      // Delete existing
      await supabase.from('governorates').delete().neq('id', 0);
      
      // Insert new
      const { error } = await supabase
        .from('governorates')
        .insert(defaultGovernorates);

      if (error) throw error;
      
      alert('تم إضافة المحافظات الـ 27 بنجاح');
      loadGovernorates();
    } catch (error) {
      console.error('Error initializing governorates:', error);
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
            <i className="fas fa-map-marked-alt me-2"></i>
            إدارة المحافظات
          </h2>
          <p className="text-muted">إدارة المحافظات المصرية الـ 27</p>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-warning me-2"
            onClick={initializeGovernorates}
          >
            <i className="fas fa-database me-2"></i>
            إضافة المحافظات الافتراضية
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', name_en: '', population: '', area: '', districts_count: '' });
              setShowModal(true);
            }}
          >
            <i className="fas fa-plus me-2"></i>
            إضافة محافظة
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">عدد المحافظات</h6>
              <h3 className="fw-bold text-success">{governorates.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">إجمالي النواب</h6>
              <h3 className="fw-bold text-primary">
                {governorates.reduce((sum, g) => sum + (g.members_count || 0), 0)}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">إجمالي المرشحين</h6>
              <h3 className="fw-bold text-info">
                {governorates.reduce((sum, g) => sum + (g.candidates_count || 0), 0)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Governorates Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>الاسم بالعربية</th>
                  <th>الاسم بالإنجليزية</th>
                  <th>عدد السكان</th>
                  <th>المساحة (كم²)</th>
                  <th>عدد الدوائر</th>
                  <th>النواب</th>
                  <th>المرشحين</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {governorates.map(gov => (
                  <tr key={gov.id}>
                    <td>{gov.id}</td>
                    <td><strong>{gov.name}</strong></td>
                    <td>{gov.name_en}</td>
                    <td>{gov.population?.toLocaleString('ar-EG') || '-'}</td>
                    <td>{gov.area?.toLocaleString('ar-EG') || '-'}</td>
                    <td>{gov.districts_count || '-'}</td>
                    <td>
                      <span className="badge bg-primary">{gov.members_count || 0}</span>
                    </td>
                    <td>
                      <span className="badge bg-info">{gov.candidates_count || 0}</span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(gov)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(gov.id)}
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
                  {editingId ? 'تعديل محافظة' : 'إضافة محافظة جديدة'}
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
                    <label className="form-label">عدد السكان</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.population}
                      onChange={(e) => setFormData({...formData, population: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">المساحة (كم²)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">عدد الدوائر</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.districts_count}
                      onChange={(e) => setFormData({...formData, districts_count: e.target.value})}
                    />
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
