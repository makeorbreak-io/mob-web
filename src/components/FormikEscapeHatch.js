import { useEffect } from "react";
import { useFormikContext } from "formik";

const FormikEscapeHatch = ({ onChange }) => {
  const context = useFormikContext();

  useEffect(() => {
    onChange(context);
  });

  return null;
};

export default FormikEscapeHatch;
