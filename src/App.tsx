import { useState, useEffect } from "react";

// Type definitions
interface User {
  rollNumber: string;
  name: string;
}

interface FormField {
  fieldId: string;
  type:
    | "text"
    | "tel"
    | "email"
    | "textarea"
    | "date"
    | "dropdown"
    | "radio"
    | "checkbox";
  label: string;
  placeholder?: string;
  required: boolean;
  dataTestId: string;
  validation?: { message: string };
  options?: Array<{ value: string; label: string; dataTestId?: string }>;
  maxLength?: number;
  minLength?: number;
}

interface FormSection {
  sectionId: number;
  title: string;
  description: string;
  fields: FormField[];
}

interface FormData {
  formTitle: string;
  formId: string;
  version: string;
  sections: FormSection[];
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [theme, setTheme] = useState("purple");

  const themes = {
    purple: {
      primary: "bg-purple-600 hover:bg-purple-700",
      secondary: "bg-pink-500 hover:bg-pink-600",
    },
    blue: {
      primary: "bg-blue-600 hover:bg-blue-700",
      secondary: "bg-teal-500 hover:bg-teal-600",
    },
    green: {
      primary: "bg-green-600 hover:bg-green-700",
      secondary: "bg-yellow-500 hover:bg-yellow-600",
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme((current) => {
        const options = Object.keys(themes);
        const currentIndex = options.indexOf(current);
        return options[(currentIndex + 1) % options.length];
      });
    }, 10000); // Change theme every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const currentTheme = themes[theme as keyof typeof themes];

  // Handle login
  const handleLogin = async (userData: User) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo form data
      const demoForm = {
        formTitle: "Student Registration Form",
        formId: "student-reg-2025",
        version: "1.0",
        sections: [
          {
            sectionId: 1,
            title: "Personal Information",
            description: "Please provide your basic details",
            fields: [
              {
                fieldId: "fullname",
                type: "text",
                label: "Full Name",
                placeholder: "Enter your full name",
                required: true,
                dataTestId: "fullname-input",
                validation: { message: "Name is required" },
              },
              {
                fieldId: "email",
                type: "email",
                label: "Email Address",
                placeholder: "your.email@example.com",
                required: true,
                dataTestId: "email-input",
                validation: { message: "Valid email is required" },
              },
              {
                fieldId: "phone",
                type: "tel",
                label: "Phone Number",
                placeholder: "10-digit phone number",
                required: true,
                dataTestId: "phone-input",
                validation: {
                  message: "Valid 10-digit phone number is required",
                },
              },
            ],
          },
          {
            sectionId: 2,
            title: "Academic Information",
            description: "Tell us about your academic background",
            fields: [
              {
                fieldId: "department",
                type: "dropdown",
                label: "Department",
                required: true,
                dataTestId: "department-input",
                options: [
                  { value: "cs", label: "Computer Science" },
                  { value: "ee", label: "Electrical Engineering" },
                  { value: "me", label: "Mechanical Engineering" },
                  { value: "ce", label: "Civil Engineering" },
                ],
                validation: { message: "Please select your department" },
              },
              {
                fieldId: "year",
                type: "radio",
                label: "Year of Study",
                required: true,
                dataTestId: "year-input",
                options: [
                  { value: "1", label: "First Year" },
                  { value: "2", label: "Second Year" },
                  { value: "3", label: "Third Year" },
                  { value: "4", label: "Fourth Year" },
                ],
                validation: { message: "Please select your year of study" },
              },
            ],
          },
          {
            sectionId: 3,
            title: "Additional Information",
            description: "Please provide some additional details",
            fields: [
              {
                fieldId: "interests",
                type: "checkbox",
                label: "I am interested in research opportunities",
                required: false,
                dataTestId: "interests-checkbox",
              },
              {
                fieldId: "bio",
                type: "textarea",
                label: "Brief Introduction",
                placeholder: "Tell us a bit about yourself...",
                required: true,
                dataTestId: "bio-input",
                validation: { message: "Please provide a brief introduction" },
                minLength: 50,
                maxLength: 500,
              },
            ],
          },
        ],
      };

      setUser(userData);
      setFormData(demoForm);
      setIsLoggedIn(true);

      // Initialize form values
      const initialValues: Record<string, any> = {};
      demoForm.sections.forEach((section) => {
        section.fields.forEach((field) => {
          initialValues[field.fieldId] = field.type === "checkbox" ? false : "";
        });
      });

      setFormValues(initialValues);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));

    // Clear error when user starts typing
    if (formErrors[fieldId]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Validate a single field
  const validateField = (field: FormField, value: any): string | null => {
    if (
      field.required &&
      (value === "" || value === null || value === undefined)
    ) {
      return field.validation?.message || "This field is required";
    }

    if (
      field.minLength &&
      typeof value === "string" &&
      value.length < field.minLength
    ) {
      return `Minimum length is ${field.minLength} characters`;
    }

    if (
      field.maxLength &&
      typeof value === "string" &&
      value.length > field.maxLength
    ) {
      return `Maximum length is ${field.maxLength} characters`;
    }

    if (field.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
      return "Please enter a valid email address";
    }

    if (field.type === "tel" && value && !/^\d{10}$/.test(value)) {
      return "Please enter a valid 10-digit phone number";
    }

    return null;
  };

  // Validate current section
  const validateSection = (sectionIndex: number): boolean => {
    if (!formData) return false;

    const section = formData.sections[sectionIndex];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    section.fields.forEach((field) => {
      const error = validateField(field, formValues[field.fieldId]);
      if (error) {
        newErrors[field.fieldId] = error;
        isValid = false;
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  // Navigate to next section
  const handleNextSection = () => {
    if (!formData) return;

    const isValid = validateSection(currentSection);
    if (isValid) {
      setCurrentSection((prev) =>
        Math.min(prev + 1, formData.sections.length - 1)
      );
    }
  };

  // Navigate to previous section
  const handlePrevSection = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData) return;

    const isValid = validateSection(currentSection);
    if (isValid) {
      setIsSubmitting(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitted(true);
      } catch (err) {
        setError("Failed to submit the form. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Render field based on type
  const renderField = (field: FormField) => {
    const error = formErrors[field.fieldId];
    const inputBaseClass = `shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-${theme}-400 transition duration-200`;
    const inputErrorClass = error ? "border-red-500" : "border-gray-300";

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "date":
        return (
          <div className="mb-5" key={field.fieldId}>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={field.fieldId}
            >
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={field.fieldId}
              type={field.type}
              data-testid={field.dataTestId}
              className={`${inputBaseClass} ${inputErrorClass}`}
              placeholder={field.placeholder}
              value={formValues[field.fieldId] || ""}
              onChange={(e) => handleInputChange(field.fieldId, e.target.value)}
              maxLength={field.maxLength}
              minLength={field.minLength}
            />
            {error && (
              <p className="text-red-500 text-xs italic mt-1">{error}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div className="mb-5" key={field.fieldId}>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={field.fieldId}
            >
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={field.fieldId}
              data-testid={field.dataTestId}
              className={`${inputBaseClass} ${inputErrorClass}`}
              placeholder={field.placeholder}
              value={formValues[field.fieldId] || ""}
              onChange={(e) => handleInputChange(field.fieldId, e.target.value)}
              maxLength={field.maxLength}
              minLength={field.minLength}
              rows={4}
            />
            {field.minLength && (
              <div className="text-xs text-gray-500 mt-1">
                Characters: {(formValues[field.fieldId] || "").length}/
                {field.maxLength || "∞"}
              </div>
            )}
            {error && (
              <p className="text-red-500 text-xs italic mt-1">{error}</p>
            )}
          </div>
        );

      case "dropdown":
        return (
          <div className="mb-5" key={field.fieldId}>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={field.fieldId}
            >
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <select
                id={field.fieldId}
                data-testid={field.dataTestId}
                className={`${inputBaseClass} ${inputErrorClass} appearance-none pr-8`}
                value={formValues[field.fieldId] || ""}
                onChange={(e) =>
                  handleInputChange(field.fieldId, e.target.value)
                }
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    data-testid={option.dataTestId}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-xs italic mt-1">{error}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div className="mb-5" key={field.fieldId}>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-2 flex flex-wrap gap-4">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`${field.fieldId}-${option.value}`}
                    type="radio"
                    name={field.fieldId}
                    data-testid={
                      option.dataTestId || `${field.dataTestId}-${option.value}`
                    }
                    value={option.value}
                    checked={formValues[field.fieldId] === option.value}
                    onChange={() =>
                      handleInputChange(field.fieldId, option.value)
                    }
                    className={`mr-2 h-4 w-4 text-${theme}-600 focus:ring-${theme}-500`}
                  />
                  <label
                    htmlFor={`${field.fieldId}-${option.value}`}
                    className="text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {error && (
              <p className="text-red-500 text-xs italic mt-1">{error}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="mb-5" key={field.fieldId}>
            <div className="flex items-center">
              <input
                id={field.fieldId}
                type="checkbox"
                data-testid={field.dataTestId}
                checked={!!formValues[field.fieldId]}
                onChange={(e) =>
                  handleInputChange(field.fieldId, e.target.checked)
                }
                className={`h-4 w-4 text-${theme}-600 focus:ring-${theme}-500 mr-2`}
              />
              <label htmlFor={field.fieldId} className="text-gray-700">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
            </div>
            {error && (
              <p className="text-red-500 text-xs italic mt-1">{error}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Render form section
  const renderSection = (section: FormSection, index: number) => {
    const isLastSection = formData && index === formData.sections.length - 1;

    return (
      <div
        className={`bg-white p-8 rounded-lg shadow-lg border-t-4 border-${theme}-500 relative overflow-hidden`}
      >
        <div
          className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-${theme}-100 opacity-50`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-32 h-32 -mb-12 -ml-12 rounded-full bg-${theme}-100 opacity-50`}
        ></div>

        <div className="relative z-10">
          <h2 className={`text-2xl font-bold mb-2 text-${theme}-700`}>
            {section.title}
          </h2>
          <p className="text-gray-600 mb-6">{section.description}</p>

          <div className="mb-6 space-y-2">
            {section.fields.map((field) => renderField(field))}
          </div>

          <div className="flex justify-between mt-8">
            {index > 0 && (
              <button
                type="button"
                onClick={handlePrevSection}
                className={`${currentTheme.secondary} text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300`}
              >
                ← Previous
              </button>
            )}

            {isLastSection ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`${currentTheme.primary} text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ml-auto flex items-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Submit</>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextSection}
                className={`${currentTheme.primary} text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ml-auto`}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Success message after submission
  const SuccessMessage = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold mt-4 mb-2">
        Form Submitted Successfully!
      </h2>
      <p className="text-gray-600 mb-6">
        Thank you for completing the form. Your responses have been recorded.
      </p>
      <button
        onClick={() => {
          setIsSubmitted(false);
          setIsLoggedIn(false);
          setUser(null);
          setFormData(null);
          setFormValues({});
          setFormErrors({});
          setCurrentSection(0);
        }}
        className={`${currentTheme.primary} text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300`}
      >
        Start New Form
      </button>
    </div>
  );

  // Login Component
  const LoginForm = () => {
    const [rollNumber, setRollNumber] = useState("");
    const [name, setName] = useState("");
    const [loginErrors, setLoginErrors] = useState({
      rollNumber: "",
      name: "",
    });

    const validateLoginForm = (): boolean => {
      const errors = { rollNumber: "", name: "" };
      let isValid = true;

      if (!rollNumber.trim()) {
        errors.rollNumber = "Roll Number is required";
        isValid = false;
      }

      if (!name.trim()) {
        errors.name = "Name is required";
        isValid = false;
      }

      setLoginErrors(errors);
      return isValid;
    };

    const handleLoginSubmit = (e: React.MouseEvent) => {
      e.preventDefault();
      if (validateLoginForm()) {
        handleLogin({ rollNumber, name });
      }
    };

    return (
      <div className="w-full max-w-md mx-auto">
        <div
          className={`bg-white shadow-xl rounded-lg px-8 pt-8 pb-8 mb-4 border-t-4 border-${theme}-500 relative overflow-hidden`}
        >
          <div
            className={`absolute top-0 right-0 w-32 h-32 -mt-12 -mr-12 rounded-full bg-${theme}-100 opacity-50`}
          ></div>
          <div
            className={`absolute bottom-0 left-0 w-32 h-32 -mb-12 -ml-12 rounded-full bg-${theme}-100 opacity-50`}
          ></div>

          <div className="relative z-10">
            <h2
              className={`text-3xl font-bold mb-6 text-center text-${theme}-700`}
            >
              Student Login
            </h2>

            <div className="mb-5">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="rollNumber"
              >
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border ${
                  loginErrors.rollNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-${theme}-400 transition duration-200`}
                id="rollNumber"
                type="text"
                placeholder="Enter your roll number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                data-testid="roll-number-input"
              />
              {loginErrors.rollNumber && (
                <p className="text-red-500 text-xs italic mt-1">
                  {loginErrors.rollNumber}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border ${
                  loginErrors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-${theme}-400 transition duration-200`}
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="name-input"
              />
              {loginErrors.name && (
                <p className="text-red-500 text-xs italic mt-1">
                  {loginErrors.name}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center">
              <button
                className={`${currentTheme.primary} text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300`}
                type="button"
                onClick={handleLoginSubmit}
                disabled={isLoading}
                data-testid="login-button"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            {error && (
              <p
                className="text-red-500 text-sm text-center mt-4"
                data-testid="error-message"
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-${theme}-50 to-${theme}-200 py-12`}
    >
      <div className="container mx-auto px-4">
        {!isLoggedIn ? (
          <LoginForm />
        ) : isSubmitted ? (
          <div className="max-w-2xl mx-auto">
            <SuccessMessage />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {formData && (
              <div className="mb-8">
                <h1
                  className={`text-3xl font-bold mb-4 text-${theme}-700 text-center`}
                >
                  {formData.formTitle}
                </h1>

                <div className="flex items-center mb-4">
                  {formData.sections.map((_, idx) => (
                    <div key={idx} className="flex-1 flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          idx < currentSection
                            ? `bg-${theme}-500 text-white`
                            : idx === currentSection
                            ? `bg-${theme}-600 text-white`
                            : `bg-gray-200 text-gray-500`
                        }`}
                      >
                        {idx + 1}
                      </div>
                      {idx < formData.sections.length - 1 && (
                        <div
                          className={`flex-1 h-1 ${
                            idx < currentSection
                              ? `bg-${theme}-500`
                              : "bg-gray-200"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>

                <p className={`text-${theme}-600 text-center font-medium`}>
                  Section {currentSection + 1}:{" "}
                  {formData.sections[currentSection].title}
                </p>
              </div>
            )}

            {formData &&
              formData.sections[currentSection] &&
              renderSection(formData.sections[currentSection], currentSection)}
          </div>
        )}
      </div>
    </div>
  );
}
