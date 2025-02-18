/**
 * External dependencies
 */
import { css } from '@emotion/react';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import deprecated from '@wordpress/deprecated';

/**
 * Internal dependencies
 */
import { useContextSystem, WordPressComponentProps } from '../../ui/context';
import { useResponsiveValue } from '../../ui/utils/use-responsive-value';
import { space } from '../../ui/utils/space';
import * as styles from '../styles';
import { useCx } from '../../utils';
import type { FlexProps } from '../types';

function useDeprecatedProps(
	props: WordPressComponentProps< FlexProps, 'div' >
): WordPressComponentProps< FlexProps, 'div' > {
	const { isReversed, ...otherProps } = props;

	if ( typeof isReversed !== 'undefined' ) {
		deprecated( 'Flex isReversed', {
			alternative: 'Flex direction="row-reverse" or "column-reverse"',
			since: '5.9',
		} );
		return {
			...otherProps,
			direction: isReversed ? 'row-reverse' : 'row',
		};
	}

	return otherProps;
}

export function useFlex( props: WordPressComponentProps< FlexProps, 'div' > ) {
	const {
		align = 'center',
		className,
		direction: directionProp = 'row',
		expanded = true,
		gap = 2,
		justify = 'space-between',
		wrap = false,
		...otherProps
	} = useContextSystem( useDeprecatedProps( props ), 'Flex' );

	const directionAsArray = Array.isArray( directionProp )
		? directionProp
		: [ directionProp ];
	const direction = useResponsiveValue( directionAsArray );

	const isColumn =
		typeof direction === 'string' && !! direction.includes( 'column' );
	const isReverse =
		typeof direction === 'string' && direction.includes( 'reverse' );

	const cx = useCx();

	const classes = useMemo( () => {
		const base = css( {
			alignItems: isColumn ? 'normal' : align,
			flexDirection: direction,
			flexWrap: wrap ? 'wrap' : undefined,
			gap: space( gap ),
			justifyContent: justify,
			height: isColumn && expanded ? '100%' : undefined,
			width: ! isColumn && expanded ? '100%' : undefined,
		} );

		return cx(
			styles.Flex,
			base,
			isColumn ? styles.ItemsColumn : styles.ItemsRow,
			className
		);
	}, [
		align,
		className,
		cx,
		direction,
		expanded,
		gap,
		isColumn,
		isReverse,
		justify,
		wrap,
	] );

	return { ...otherProps, className: classes, isColumn };
}
