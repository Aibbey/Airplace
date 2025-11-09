"use client";

import React, { useState } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
  Fieldset,
  Button,
  Checkbox,
} from "@headlessui/react";
import { CheckIcon, X } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export function Login() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      refName="#Login"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 overflow-y-auto">
        <DialogPanel className="w-full max-w-md rounded-md bg-white p-10 text-black">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <DialogTitle className="font-bold text-3xl">Sign in</DialogTitle>
            <X
              onClick={() => setIsOpen(false)}
              className="size-8 bg-transparent hover:bg-blue-100 rounded-lg text-gray-400 hover:text-black justify-center cursor-pointer"
            />
          </div>

          <Description className="pt-4 w-full">
            <Fieldset className="rounded-xl bg-white">
              <Field>
                <Label className="font-medium text-black">Username</Label>
                <Input
                  className={clsx(
                    "mt-3 block w-full outline-2 outline-offset-2 outline-gray-200 rounded-lg bg-white/5 py-1.5 text-sm/6 text-black",
                    "data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-100"
                  )}
                />
              </Field>
              <Field>
                <Label className="font-medium text-black">Password</Label>
                <Input
                  type="password"
                  className={clsx(
                    "mt-3 block w-full outline-2 -outline-offset-2 outline-gray-200 rounded-lg bg-white/5 py-1.5 text-sm/6 text-black",
                    "data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-blue-100"
                  )}
                />
              </Field>
            </Fieldset>
          </Description>

          <div className="mt-4">
            <Checkbox className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-white data-focus:outline data-focus:outline-offset-2 data-focus:outline-white">
              <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
            </Checkbox>
          </div>

          <div className="mt-6 flex justify-between">
            <Button>Sign in</Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
