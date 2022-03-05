import React, { forwardRef, MutableRefObject } from 'react';
import { FlatList, FlatListProps, LayoutChangeEvent } from 'react-native';
import WrappedComponents from './WrappedComponents';
import createAnimatedComponent from '../../createAnimatedComponent';
import { ILayoutAnimationBuilder } from '../layoutReanimation/animationBuilder/commonTypes';

const AnimatedFlatList = createAnimatedComponent(FlatList as any) as any;

const createCellRenderer = (itemLayoutAnimation?: ILayoutAnimationBuilder) => {
  const cellRenderer: React.FC<{
    onLayout: (event: LayoutChangeEvent) => void;
  }> = (props) => {
    return (
      <WrappedComponents.View
        layout={itemLayoutAnimation}
        onLayout={props.onLayout}>
        {props.children}
      </WrappedComponents.View>
    );
  };

  return cellRenderer;
};

interface ReanimatedFlatlistProps<ItemT> extends FlatListProps<ItemT> {
  itemLayoutAnimation?: ILayoutAnimationBuilder;
}

type ForwardedRef<T> =
  | ((instance: T | null) => void)
  | MutableRefObject<T | null>
  | null;

type ReanimatedFlatListFC<T = any> = React.FC<
  ReanimatedFlatlistProps<T> & {
    forwardRef?: ForwardedRef<FlatList | undefined>;
  }
>;

const ReanimatedFlatlist: ReanimatedFlatListFC = ({
  itemLayoutAnimation,
  forwardRef,
  ...restProps
}) => {
  const cellRenderer = React.useMemo(
    () => createCellRenderer(itemLayoutAnimation),
    []
  );
  return (
    <AnimatedFlatList
      ref={forwardRef}
      {...restProps}
      CellRendererComponent={cellRenderer}
    />
  );
};

const FlatListRefForward = <T,>(
  props: ReanimatedFlatlistProps<T>,
  forwardRef?: ForwardedRef<FlatList<T> | undefined>
) => <ReanimatedFlatlist {...props} forwardRef={forwardRef} />;

type ReType = <T>(
  props: ReanimatedFlatlistProps<T> & {
    ref?: React.Ref<FlatList<T> | undefined>;
  }
) => JSX.Element | null;

export default forwardRef<FlatList | undefined, ReanimatedFlatlistProps<any>>(
  FlatListRefForward
) as ReType;
