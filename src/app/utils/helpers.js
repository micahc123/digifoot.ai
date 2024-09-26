export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  export const calculatePrivacyScore = (userData) => {
    // Implement privacy score calculation logic
  };