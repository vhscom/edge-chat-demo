import { ReactNode } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <Tooltip.Provider delayDuration={300}>
            {children}
        </Tooltip.Provider>
    );
}