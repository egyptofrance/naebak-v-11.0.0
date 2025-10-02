'use client';

import { useState } from 'react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientType: 'نائب' | 'مرشح';
}

export default function MessageModal({ isOpen, onClose, recipientName, recipientType }: MessageModalProps) {
  const [message, setMessage] = useState('');
  const maxLength = 500;
  const remainingChars = maxLength - message.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('يرجى كتابة رسالة قبل الإرسال');
      return;
    }
    
    // هنا سيتم إرسال الرسالة للباك إند
    console.log({
      recipient: recipientName,
      recipientType,
      message: message.trim()
    });
    
    alert('تم إرسال الرسالة بنجاح');
    setMessage('');
    onClose();
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        onClick={handleClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        tabIndex={-1} 
        style={{ zIndex: 1050 }}
        onClick={handleClose}
      >
        <div 
          className="modal-dialog modal-dialog-centered modal-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header" style={{ backgroundColor: '#004705' }}>
              <h5 className="modal-title text-white fw-bold">
                إرسال رسالة إلى {recipientType} {recipientName}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleClose}
                aria-label="إغلاق"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#004705' }}>
                    نص الرسالة <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={6}
                    placeholder={`اكتب رسالتك إلى ${recipientType} ${recipientName} هنا...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={maxLength}
                    required
                    style={{ 
                      fontSize: '0.9rem', 
                      resize: 'vertical',
                      minHeight: '120px'
                    }}
                  />
                  <div className="text-end mt-2">
                    <small 
                      className="text-muted" 
                      style={{ fontSize: '0.8rem' }}
                    >
                      {remainingChars} حرف متبقي من {maxLength}
                    </small>
                  </div>
                </div>

                <div className="alert alert-info" role="alert">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>ملاحظة:</strong> لا يمكن إرفاق ملفات أو صور في الرسائل المباشرة. 
                  لإرسال مستندات، يرجى استخدام نظام الشكاوى.
                </div>

                {/* Footer Buttons */}
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleClose}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: '#004705' }}
                    disabled={!message.trim()}
                  >
                    <i className="fas fa-paper-plane me-2"></i>
                    إرسال الرسالة
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
