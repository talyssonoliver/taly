import type React from "react";

interface Service {
  id: string;
  name: string;
}

interface ServiceSelectorProps {
  services: Service[];
  onServiceSelect: (service: Service) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  onServiceSelect,
}) => {
  const handleServiceClick = (service: Service) => {
    if (onServiceSelect) {
      onServiceSelect(service);
    } else {
      alert(`Service selected: ${service.name}`);
    }
  };

  return (
    <div>
      <h3>Selecione o Serviço:</h3>
      <div>
        {services.map((service) => (
          <button
            type="button"
            key={service.id}
            onClick={() => handleServiceClick(service)}
          >
            {service.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;
