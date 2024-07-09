// "use client";

// import { useRef, useImperativeHandle } from "react";

// import { useForm, FC } from "react-hook-form";

// import { useRouter } from "next/navigation";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { z } from "zod";

// import { useQueryClient } from "@tanstack/react-query";

// import { useSession } from "next-auth/react";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// export default function Controls({ }) {
//   const formRef = useRef();

//   return (
//     <div className="flex items-center space-x-2 text-sm sm:flex-row">
//       <Button size="sm" variant="primary-outline">
//         Cancel
//       </Button>
//       <Button type="submit" onClick={() => formRef.current.submitForm()} size="sm">
//         Continue
//       </Button>
//     </div>
//   );
// }
