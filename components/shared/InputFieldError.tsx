import { getInputFieldError, IInputErrorState } from "@/lib/getInputFieldError";

interface InputFieldErrorProps {
  field: string;
  state: IInputErrorState | null | undefined;
}

const InputFieldError = ({ field, state }: InputFieldErrorProps) => {
  if (getInputFieldError(field, state)) {
    return (
      <p className="text-sm text-destructive mt-1">
        {getInputFieldError(field, state)}
      </p>
    );
  }

  return null;
};

export default InputFieldError;

