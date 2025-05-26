import React, { useState } from 'react';
import { cabins } from '../../data/cabins';
import { activities } from '../../data/activities';
import { MapPin, Tent, Sailboat, Map, Fish, Camera, Bike, Moon, Snowflake, Flame, Info } from 'lucide-react';

const CampMap: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<{
    type: 'cabin' | 'activity';
    id: string;
    name: string;
    description: string;
    image?: string;
  } | null>(null);

  // Map points with their positions
  const mapPoints = [
    // Cabins
    ...cabins.map((cabin, index) => ({
      id: cabin.id,
      type: 'cabin' as const,
      name: cabin.name,
      description: cabin.description,
      image: cabin.images[0],
      x: 20 + ((index % 3) * 25),
      y: 20 + (Math.floor(index / 3) * 15),
      icon: Tent
    })),
    
    // Activities
    ...activities.map((activity, index) => {
      // Select the appropriate icon
      let IconComponent;
      switch (activity.icon) {
        case 'map': IconComponent = Map; break;
        case 'sailboat': IconComponent = Sailboat; break;
        case 'flame': IconComponent = Flame; break;
        case 'fish': IconComponent = Fish; break;
        case 'camera': IconComponent = Camera; break;
        case 'bike': IconComponent = Bike; break;
        case 'moon': IconComponent = Moon; break;
        case 'snowflake': IconComponent = Snowflake; break;
        default: IconComponent = Info; break;
      }
      
      return {
        id: activity.id,
        type: 'activity' as const,
        name: activity.name,
        description: activity.description,
        image: activity.images[0],
        x: 10 + ((index % 4) * 25),
        y: 50 + (Math.floor(index / 4) * 15),
        icon: IconComponent
      };
    })
  ];

  const handlePointClick = (point: typeof mapPoints[0]) => {
    setSelectedPoint({
      type: point.type,
      id: point.id,
      name: point.name,
      description: point.description,
      image: point.image
    });
  };

  return (
    <div className="relative bg-green-50 rounded-xl overflow-hidden border-4 border-green-700 shadow-xl">
      <div className="aspect-[16/9] relative">
        {/* Map background */}
        <div 
          className="absolute inset-0 bg-contain bg-no-repeat bg-center"
          style={{ 
            backgroundImage: `url('https://images.pexels.com/photos/4992432/pexels-photo-4992432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
            backgroundSize: 'cover',
            opacity: 0.2
          }}
        ></div>
        
        {/* Map elements */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full z-10"
        >
          {/* Paths connecting points */}
          <path 
            d="M20,20 Q30,35 35,45 T50,65" 
            stroke="#2D6A4F" 
            strokeWidth="0.5" 
            fill="none" 
            strokeDasharray="1,1"
          />
          <path 
            d="M45,20 Q50,30 60,50 T85,65" 
            stroke="#2D6A4F" 
            strokeWidth="0.5" 
            fill="none" 
            strokeDasharray="1,1"
          />
          <path 
            d="M70,20 Q65,35 60,50 T35,65" 
            stroke="#2D6A4F" 
            strokeWidth="0.5" 
            fill="none" 
            strokeDasharray="1,1"
          />
          <path 
            d="M10,65 L90,65" 
            stroke="#1E88E5" 
            strokeWidth="1" 
            fill="none"
          />
          
          {/* Lake */}
          <ellipse 
            cx="50" 
            cy="80" 
            rx="30" 
            ry="10" 
            fill="#90E0EF" 
            opacity="0.7"
          />
          <text 
            x="50" 
            y="80" 
            fontSize="2" 
            fill="#1E40AF" 
            textAnchor="middle"
          >
            Crystal Lake
          </text>
          
          {/* Forest areas */}
          <circle 
            cx="15" 
            cy="30" 
            r="8" 
            fill="#40916C" 
            opacity="0.5"
          />
          <text 
            x="15" 
            y="30" 
            fontSize="1.5" 
            fill="#1B4332" 
            textAnchor="middle"
          >
            Pine Forest
          </text>
          
          <circle 
            cx="85" 
            cy="35" 
            r="10" 
            fill="#40916C" 
            opacity="0.5"
          />
          <text 
            x="85" 
            y="35" 
            fontSize="1.5" 
            fill="#1B4332" 
            textAnchor="middle"
          >
            Maple Grove
          </text>
          
          {/* Map points */}
          {mapPoints.map((point, index) => {
            const IconComp = point.icon;
            return (
              <g
                key={index}
                transform={`translate(${point.x},${point.y})`}
                onClick={() => handlePointClick(point)}
                className="cursor-pointer hover:drop-shadow-xl transition-all duration-300"
              >
                <foreignObject width="6" height="6" x="-3" y="-3">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full ${
                    point.type === 'cabin' ? 'bg-green-700' : 'bg-blue-600'
                  }`}>
                    <IconComp className="h-3 w-3 text-white" />
                  </div>
                </foreignObject>
                <text 
                  y="5" 
                  fontSize="1.2" 
                  fill={point.type === 'cabin' ? '#2D6A4F' : '#1E40AF'} 
                  textAnchor="middle"
                  className="pointer-events-none font-semibold"
                >
                  {point.name.length > 15 ? point.name.substring(0, 15) + '...' : point.name}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Map Legend */}
        <div className="absolute bottom-2 left-2 bg-white/80 p-2 rounded-lg shadow-md z-20">
          <h4 className="text-xs font-semibold text-gray-800 mb-1">Map Legend</h4>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-700 rounded-full mr-1"></div>
              <span>Cabins</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
              <span>Activities</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-300 rounded mr-1"></div>
              <span>Water</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600/50 rounded mr-1"></div>
              <span>Forest</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Info Panel */}
      {selectedPoint && (
        <div className="p-4 bg-white border-t-2 border-green-700">
          <div className="flex">
            {selectedPoint.image && (
              <img 
                src={selectedPoint.image} 
                alt={selectedPoint.name} 
                className="w-24 h-24 object-cover rounded-lg mr-4"
              />
            )}
            <div>
              <div className="flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  selectedPoint.type === 'cabin' ? 'bg-green-700' : 'bg-blue-600'
                }`}></span>
                <h3 className="text-lg font-bold text-gray-800">{selectedPoint.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{selectedPoint.description}</p>
              <a 
                href={`/${selectedPoint.type}s/${selectedPoint.id}`} 
                className="inline-block mt-2 text-sm text-green-700 hover:text-green-900 font-medium"
              >
                View Details →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampMap;