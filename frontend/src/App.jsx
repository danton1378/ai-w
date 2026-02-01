import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import AuthModal from './components/AuthModal';
import PlanSelector from './components/PlanSelector';
import PaymentModal from './components/PaymentModal';
import PLANS from '../../plans.json';

function App() {
  // localStorage-based account persistence (MVP only)
  // WARNING: Not secure for production. See README.
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ai_user'));
    } catch {
      return null;
    }
  });

  const [subscription, setSubscription] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ai_subscription'));
    } catch {
      return null;
    }
  });
  const [showAuth, setShowAuth] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    localStorage.setItem('ai_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ai_subscription', JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  function handleLogin(userObj) {
    setUser(userObj);
    setShowAuth(false);
  }

  function handleLogout() {
    setUser(null);
    setSubscription(null);
    localStorage.removeItem('ai_user');
    localStorage.removeItem('ai_subscription');
  }

  function requireAuthThen(action) {
    if (!user) {
      setShowAuth(true);
    } else {
      action();
    }
  }

  return (
    <div className="app">
      <Sidebar
        user={user}
        subscription={subscription}
        onLogin={() => setShowAuth(true)}
        onLogout={handleLogout}
        onSelectPlans={() => setShowPlans(true)}
        dark={dark}
        setDark={setDark}
      />
      <main className="main">
        <Chat user={user} subscription={subscription} />
      </main>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />
      )}

      {showPlans && (
        <PlanSelector
          plans={PLANS.plans}
          onClose={() => setShowPlans(false)}
          onBuy={(planKey) => {
            if (!user) {
              setShowAuth(true);
            } else {
              setSelectedPlan(planKey);
              setShowPayment(true);
            }
          }}
        />
      )}

      {showPayment && (
        <PaymentModal
          planKey={selectedPlan}
          user={user}
          onClose={() => setShowPayment(false)}
          onActivate={(sub) => {
            setSubscription(sub);
            setShowPayment(false);
            // unlock higher-efficiency AI mode (front-end effect)
            alert('Congratulations! Your subscription is active.');
          }}
        />
      )}
    </div>
  );
}

export default App;