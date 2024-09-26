import { useEffect, useRef } from 'react';

export default function PrivacyScoreCard() {
  const privacyScore = 85; // Example score
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    const drawCircle = (percentage) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 10;
      ctx.stroke();

      // Draw percentage arc
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (percentage / 100) * (2 * Math.PI);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 10;
      ctx.stroke();

      // Draw text
      ctx.font = 'bold 30px Poppins';
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${percentage}%`, centerX, centerY);
    };

    let currentPercentage = 0;
    const animateCircle = () => {
      if (currentPercentage < privacyScore) {
        currentPercentage++;
        drawCircle(currentPercentage);
        requestAnimationFrame(animateCircle);
      }
    };

    animateCircle();
  }, [privacyScore]);

  return (
    <div className="glass-effect rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-4 text-gradient">Privacy Score</h3>
      <div className="flex justify-center">
        <canvas ref={canvasRef} width="200" height="200" className="animate-spin-slow" />
      </div>
    </div>
  );
}