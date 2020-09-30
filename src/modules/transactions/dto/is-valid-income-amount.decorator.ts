import { registerDecorator, ValidationArguments } from 'class-validator';
import { TransactionTypes } from 'src/shared/enums/transaction-types.enum';

export function IsValidIncomeAmount() {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidIncomeAmount',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: 'Income amount should be positive' },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value && value !== 0) {
            return true;
          }
          if ((args.object as any).type !== TransactionTypes.INCOME) {
            return true;
          }

          return typeof value === 'number' && value > 0;
        },
      },
    });
  };
}
