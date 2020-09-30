import { registerDecorator, ValidationArguments } from 'class-validator';
import { TransactionTypes } from 'src/shared/enums/transaction-types.enum';

export function IsValidExpenseAmount() {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidExpenseAmount',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: 'Expense amount should be negative' },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value && value !== 0) {
            return true;
          }
          if ((args.object as any).type !== TransactionTypes.EXPENSE) {
            return true;
          }

          return typeof value === 'number' && value < 0;
        },
      },
    });
  };
}
