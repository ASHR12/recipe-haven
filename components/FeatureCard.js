// components/FeatureCard.js
export default function FeatureCard({ title, description }) {
  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4 text-white shadow-text">
        {title}
      </h2>
      <p className="text-gray-200">{description}</p>
    </div>
  );
}
