export interface IInputErrorState {
    success?: boolean;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}

export const getInputFieldError = (field: string, state: IInputErrorState | null | undefined): string | null => {
    if (!state || !state.errors) {
        return null;
    }

    const error = state.errors.find((err) => err.field === field);
    return error ? error.message : null;
};

