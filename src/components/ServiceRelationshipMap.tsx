import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Network, Info, ExternalLink } from 'lucide-react';
import { getServiceRelationship, getSiblingServices, getParentCompany } from '../data/serviceRelationships';
import { childServiceCatalog, getServiceById } from '../data/childServiceCatalog';
import { getServiceLogoUrlWithBrandColor, hasServiceLogo } from '../utils/serviceLogos';

interface ServiceRelationshipMapProps {
  serviceId: string;
  onServiceClick?: (serviceId: string) => void;
}

const ServiceRelationshipMap: React.FC<ServiceRelationshipMapProps> = ({ 
  serviceId, 
  onServiceClick 
}) => {
  const relationship = getServiceRelationship(serviceId);
  const parentCompany = getParentCompany(serviceId);
  const siblings = getSiblingServices(serviceId);
  const currentService = getServiceById(serviceId);

  if (!relationship || (!parentCompany && (!siblings || siblings.length === 0))) {
    return null;
  }

  const siblingServices = siblings
    .map(id => getServiceById(id))
    .filter(service => service !== undefined) as typeof currentService[];

  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-start space-x-2 mb-3">
        <Network className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Service Relationships
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Understanding how services share data can help protect your family's privacy.
          </p>
        </div>
      </div>

      {parentCompany && (
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Parent Company: {parentCompany}
            </span>
          </div>
          <div className="ml-6 text-xs text-blue-700 dark:text-blue-300">
            <Info className="h-3 w-3 inline mr-1" />
            Services owned by the same company may share data with each other.
          </div>
        </div>
      )}

      {siblingServices.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Network className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Related Services ({siblingServices.length})
            </span>
          </div>
          <div className="ml-6 space-y-2">
            {siblingServices.map((sibling) => (
              <div
                key={sibling.id}
                className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                onClick={() => onServiceClick?.(sibling.id)}
              >
                {hasServiceLogo(sibling.id) ? (
                  <img
                    src={getServiceLogoUrlWithBrandColor(sibling.id) || undefined}
                    alt={`${sibling.name} logo`}
                    className="w-6 h-6 rounded object-contain"
                  />
                ) : (
                  <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {sibling.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-sm text-blue-900 dark:text-blue-100 flex-1">
                  {sibling.name}
                </span>
                {sibling.website && (
                  <a
                    href={sibling.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="ml-6 mt-2 text-xs text-blue-700 dark:text-blue-300">
            <Info className="h-3 w-3 inline mr-1" />
            These services may share your data with each other. Review privacy settings for all related services.
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRelationshipMap;

