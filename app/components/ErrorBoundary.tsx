import { useRouteError } from '@remix-run/react';
import { ValidationError } from '~/utils/validation';

export function ErrorBoundary() {
    const error = useRouteError();

    if (error instanceof ValidationError) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h2 className="text-lg font-semibold text-red-800">Validation Error</h2>
                <ul className="mt-2 list-disc list-inside text-red-700">
                    {error.errors.errors.map((err, index) => (
                        <li key={index}>{err.message}</li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
            <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
            <p className="mt-2 text-red-700">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
        </div>
    );
}