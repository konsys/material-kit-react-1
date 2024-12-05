import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';
import type { ContainerProps } from '@mui/material/Container';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import {  useQuery } from '@tanstack/react-query';
import { layoutClasses } from 'src/layouts/classes';
import { uniswapQuote } from '../../modules/quote';
import { TokensAvailable } from '../../modules/constants';

// ----------------------------------------------------------------------

export function Main({ children, sx, ...other }: BoxProps) {

  const queryData = useQuery({
    queryKey: ['quote'],
    queryFn: () => uniswapQuote(1, TokensAvailable.WETH, TokensAvailable.USDT),
    
  });

  console.log(queryData.data)
  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

type DashboardContentProps = ContainerProps & {
  disablePadding?: boolean;
};

export function DashboardContent({
  sx,
  children,
  disablePadding,
  maxWidth = 'xl',
  ...other
}: DashboardContentProps) {
  const theme = useTheme();

  const layoutQuery: Breakpoint = 'lg';

  return (
    <Container
      className={layoutClasses.content}
      maxWidth={maxWidth || false}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        pt: 'var(--layout-dashboard-content-pt)',
        pb: 'var(--layout-dashboard-content-pb)',
        [theme.breakpoints.up(layoutQuery)]: {
          px: 'var(--layout-dashboard-content-px)',
        },
        ...(disablePadding && {
          p: {
            xs: 0,
            sm: 0,
            md: 0,
            lg: 0,
            xl: 0,
          },
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Container>
  );
}
