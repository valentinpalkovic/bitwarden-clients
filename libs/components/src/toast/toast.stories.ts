import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";
import { action } from "storybook/actions";

import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";

import { ButtonModule } from "../button";
import { I18nMockService } from "../utils/i18n-mock.service";

import { ToastComponent } from "./toast.component";
import { BitwardenToastrGlobalConfig, ToastModule } from "./toast.module";
import { ToastOptions, ToastService } from "./toast.service";

const toastServiceExampleTemplate = `
  <button bitButton type="button" (click)="toastService.showToast(toastOptions)">Show Toast</button>
`;
@Component({
  selector: "toast-service-example",
  template: toastServiceExampleTemplate,
})
export class ToastServiceExampleComponent {
  @Input()
  toastOptions?: ToastOptions;

  constructor(protected toastService: ToastService) {}
}

export default {
  title: "Component Library/Toast",
  component: ToastComponent,

  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, ButtonModule, ToastModule],
      declarations: [ToastServiceExampleComponent],
    }),
    applicationConfig({
      providers: [
        ToastModule.forRoot().providers!,
        {
          provide: I18nService,
          useFactory: () => {
            return new I18nMockService({
              close: "Close",
              success: "Success",
              error: "Error",
              warning: "Warning",
              info: "Info",
            });
          },
        },
      ],
    }),
  ],
  args: {
    onClose: action("emit onClose"),
    variant: "info",
    progressWidth: 50,
    title: "",
    message: "Hello Bitwarden!",
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/Zt3YSeb6E6lebAffrNLa0h/Tailwind-Component-Library?node-id=16329-41506&t=b5tDKylm5sWm2yKo-11",
    },
  },
} as Meta;

type Story = StoryObj<ToastComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="tw-flex tw-flex-col tw-min-w tw-max-w-[--bit-toast-width]">
        <bit-toast [title]="title" [message]="message" [progressWidth]="progressWidth" (onClose)="onClose()" variant="success"></bit-toast>
        <bit-toast [title]="title" [message]="message" [progressWidth]="progressWidth" (onClose)="onClose()" variant="info"></bit-toast>
        <bit-toast [title]="title" [message]="message" [progressWidth]="progressWidth" (onClose)="onClose()" variant="warning"></bit-toast>
        <bit-toast [title]="title" [message]="message" [progressWidth]="progressWidth" (onClose)="onClose()" variant="error"></bit-toast>
      </div>
    `,
  }),
};

/**
 * Avoid using long messages in toasts.
 */
export const LongContent: Story = {
  ...Default,
  args: {
    title: "Foo",
    message: [
      "Lorem ipsum dolor sit amet, consectetur adipisci",
      "Lorem ipsum dolor sit amet, consectetur adipisci",
    ],
  },
};

export const Service: Story = {
  render: (args) => ({
    props: {
      toastOptions: args,
    },
    template: /*html*/ `
      <!-- Toast container is used here to more closely align with how toasts are used in the clients, which allows for more accurate SR testing in storybook -->
      <bit-toast-container></bit-toast-container>
      <toast-service-example [toastOptions]="toastOptions"></toast-service-example>
    `,
  }),
  args: {
    title: "",
    message: "Hello Bitwarden!",
    variant: "error",
    timeout: BitwardenToastrGlobalConfig.timeOut,
  } as ToastOptions,
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      source: {
        code: toastServiceExampleTemplate,
      },
    },
  },
};
