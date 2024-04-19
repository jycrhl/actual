// @ts-strict-ignore
import React, { type ComponentPropsWithoutRef } from 'react';

import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { SvgArrowThinRight } from '../../icons/v1';
import { type CSSProperties } from '../../style';
import { View } from '../common/View';
import { type Binding } from '../spreadsheet';
import { CellValue } from '../spreadsheet/CellValue';
import { useSheetValue } from '../spreadsheet/useSheetValue';

import { makeAmountStyle } from './util';

type BalanceWithCarryoverProps = Omit<
  ComponentPropsWithoutRef<typeof CellValue>,
  'binding'
> & {
  carryover: Binding;
  balance: Binding;
  goal?: Binding;
  budgeted?: Binding;
  disabled?: boolean;
  style?: CSSProperties;
  carryoverStyle?: CSSProperties;
};
export function BalanceWithCarryover({
  carryover,
  balance,
  goal,
  budgeted,
  disabled,
  carryoverStyle,
  ...props
}: BalanceWithCarryoverProps) {
  const carryoverValue = useSheetValue(carryover);
  const balanceValue = useSheetValue(balance);
  const goalValue = useSheetValue(goal);
  const budgetedValue = useSheetValue(budgeted);
  const isGoalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');
  return (
    <View>
      <CellValue
        {...props}
        binding={balance}
        type="financial"
        getStyle={value =>
          makeAmountStyle(
            value,
            isGoalTemplatesEnabled ? goalValue : null,
            budgetedValue,
          )
        }
        style={{
          textAlign: 'right',
          ...(!disabled && {
            cursor: 'pointer',
            ':hover': { textDecoration: 'underline' },
          }),
          ...props.style,
        }}
      />
      {carryoverValue && (
        <View
          style={{
            alignSelf: 'center',
            marginLeft: 2,
            position: 'absolute',
            right: -8,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            ...carryoverStyle,
          }}
        >
          <SvgArrowThinRight
            width={carryoverStyle?.width || 7}
            height={carryoverStyle?.height || 7}
            style={makeAmountStyle(balanceValue, goalValue, budgetedValue)}
          />
        </View>
      )}
    </View>
  );
}
