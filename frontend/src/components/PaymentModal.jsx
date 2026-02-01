import React, { useState } from 'react';
import { purchasePlan, verifyPayment } from '../services/api';

/**
 * Simulated UPI payment modal:
 * - User chooses UPI app (simulated)
 * - Backend returns paymentId & upi number
 * - User "confirms" payment via the modal and we call /verify with txStatus=SUCCESS
 *
 * On verification success, parent receives a subscription object and persists to localStorage.
 */
export default function PaymentModal({ planKey, user, onClose, onActivate }) {
  const [selectedUpiApp, setSelectedUpiApp] = useState('GooglePay');
  const [paymentId, setPaymentId] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const UPI_APPS = ['GooglePay', 'PhonePe', 'Paytm', 'BHIM'];

  async function startPayment() {
    setLoading(true);
    try {
      const res = await purchasePlan(user.id, planKey);
      setPaymentId(res.paymentId);
      setPaymentInfo(res);
    } catch (err) {
      alert('Purchase failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }

  async function confirmPayment() {
    if (!paymentId || !paymentInfo) return alert('Start payment first');
    setLoading(true);
    try {
      // Simulate UPI app confirmation -> we call verify with success
      const res = await verifyPayment(paymentId, 'SUCCESS', paymentInfo.amount);
      // res.subscription contains subscription that client will store
      onActivate(res.subscription);
      onClose();
    } catch (err) {
      alert('Verification failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal">
      <div className="panel">
        <h3>Purchase Plan: {planKey}</h3>
        <div>
          <label>UPI App</label>
          <select value={selectedUpiApp} onChange={(e) => setSelectedUpiApp(e.target.value)}>
            {UPI_APPS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div style={{ marginTop: 8 }}>
          {!paymentInfo ? (
            <button onClick={startPayment} disabled={loading || !user}>Open UPI</button>
          ) : (
            <>
              <div>Payment request created: {paymentId}</div>
              <div>Pay {paymentInfo.amount} to {paymentInfo.upi} via your chosen UPI app.</div>
              <div style={{ marginTop: 8 }}>
                <button onClick={confirmPayment} disabled={loading}>I have paid (simulate)</button>
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}