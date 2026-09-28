import { cn } from '@/shared/lib';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

const typographyVariants = cva('', {
	variants: {
		variant: {
			h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
			h2: 'scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0',
			h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
			h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
			p: 'leading-7 [&:not(:first-child)]:mt-6',
			blockquote: 'mt-6 border-l-2 pl-6 italic',
			ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
			lead: 'text-xl text-muted-foreground',
			large: 'text-lg font-semibold',
			small: 'text-sm font-medium leading-none',
			muted: 'text-sm text-muted-foreground',
		},
	},
	defaultVariants: {
		variant: 'p',
	},
});

type TypographyProps<Element extends ElementType = 'p'> = {
	as?: Element;
	className?: string;
	children?: ReactNode;
} & VariantProps<typeof typographyVariants> &
	ComponentPropsWithoutRef<Element>;

function Typography<Element extends ElementType = 'p'>({
	as,
	className,
	variant,
	children,
	...props
}: TypographyProps<Element>) {
	const Component = as || 'p';

	return (
		<Component
			className={cn(typographyVariants({ variant, className }))}
			{...props}
		>
			{children}
		</Component>
	);
}

export { Typography, typographyVariants };
