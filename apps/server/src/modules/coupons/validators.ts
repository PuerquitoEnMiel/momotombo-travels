import { registerDecorator, type ValidationOptions } from 'class-validator';

const SCOPES = ['GLOBAL', 'DESTINATION', 'ACTIVITY', 'CATEGORY'] as const;

export function IsScope(options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isScope',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: unknown) {
          return (
            typeof value === 'string' &&
            (SCOPES as readonly string[]).includes(value)
          );
        },
        defaultMessage() {
          return `scope must be one of: ${SCOPES.join(', ')}`;
        },
      },
    });
  };
}
