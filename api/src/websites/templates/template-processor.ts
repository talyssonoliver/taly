import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

/**
 * Utility for processing HTML templates with Handlebars
 */
export class TemplateProcessor {
  private templateCache: Record<string, Handlebars.TemplateDelegate> = {};

  constructor() {
    this.registerHelpers();
  }

  /**
   * Process a template file with provided context data
   * @param templatePath Path to the template file
   * @param context Data to use for template processing
   * @returns Processed HTML string
   */
  public processTemplate(templatePath: string, context: Record<string, any>): string {
    try {
      const template = this.getTemplate(templatePath);
      return template(this.prepareContext(context));
    } catch (error) {
      console.error(Error processing template \:, error);
      throw error;
    }
  }

  /**
   * Get a template by path, using cache if available
   */
  private getTemplate(templatePath: string): Handlebars.TemplateDelegate {
    if (!this.templateCache[templatePath]) {
      try {
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        this.templateCache[templatePath] = Handlebars.compile(templateContent);
      } catch (error) {
        console.error(Error loading template \:, error);
        throw error;
      }
    }
    
    return this.templateCache[templatePath];
  }

  /**
   * Register custom Handlebars helpers
   */
  private registerHelpers(): void {
    // Helper for iterating n times
    Handlebars.registerHelper('times', function(n, block) {
      let result = '';
      for (let i = 0; i < n; i++) {
        result += block.fn(i);
      }
      return result;
    });

    // Helper for formatting dates
    Handlebars.registerHelper('formatDate', function(date, format) {
      if (!date) return '';
      
      const d = new Date(date);
      
      const pad = (num: number) => num.toString().padStart(2, '0');
      
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      
      if (format === 'MM/DD/YYYY') {
        return ${mm}//;
      } else if (format === 'YYYY-MM-DD') {
        return ${yyyy}--;
      }
      
      return d.toLocaleDateString();
    });

    // Helper for conditional checking
    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    });

    // Helper for checking if a value exists in an array
    Handlebars.registerHelper('ifIn', function(elem, list, options) {
      if (list && list.indexOf && list.indexOf(elem) > -1) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    // Helper to get current year
    Handlebars.registerHelper('currentYear', function() {
      return new Date().getFullYear();
    });

    // Helper for creating JSON string
    Handlebars.registerHelper('json', function(context) {
      return JSON.stringify(context);
    });

    // Helper for default values
    Handlebars.registerHelper('defaultValue', function(value, defaultValue) {
      return value != null ? value : defaultValue;
    });
  }

  /**
   * Prepare context data for template processing
   * - Adds default values
   * - Processes conditional content with pipe syntax (e.g., "value|default")
   */
  private prepareContext(context: Record<string, any>): Record<string, any> {
    const result = { ...context };
    
    // Process all string values to handle pipe syntax for defaults
    for (const key in result) {
      if (typeof result[key] === 'string') {
        const parts = result[key].split('|');
        if (parts.length > 1 && parts[0].trim() === '') {
          // If the value before the pipe is empty, use the default
          result[key] = parts[1].trim();
        }
      }
    }
    
    // Add current year if not present
    if (!result.current_year) {
      result.current_year = new Date().getFullYear();
    }
    
    return result;
  }

  /**
   * Load partial templates from directory
   * @param dirPath Path to partials directory
   */
  public loadPartials(dirPath: string): void {
    try {
      const files = fs.readdirSync(dirPath);
      
      files.forEach(file => {
        if (file.endsWith('.hbs')) {
          const partialName = path.basename(file, '.hbs');
          const partialPath = path.join(dirPath, file);
          const partialContent = fs.readFileSync(partialPath, 'utf8');
          
          Handlebars.registerPartial(partialName, partialContent);
        }
      });
    } catch (error) {
      console.error('Error loading partials:', error);
    }
  }

  /**
   * Clear template cache
   */
  public clearCache(): void {
    this.templateCache = {};
  }
}

/**
 * Example usage:
 * 
 * const processor = new TemplateProcessor();
 * 
 * // Load any partial templates
 * processor.loadPartials('./templates/partials');
 * 
 * // Process a template with data
 * const html = processor.processTemplate('./templates/default/index.html', {
 *   business_name: 'My Business',
 *   business_logo: '/images/logo.png',
 *   hero_title: 'Welcome to My Business',
 *   services: [
 *     { id: '1', name: 'Service 1', description: 'Description 1', price: 99 }
 *   ]
 * });
 * 
 * // Write processed HTML to file
 * fs.writeFileSync('./public/index.html', html);
 */
