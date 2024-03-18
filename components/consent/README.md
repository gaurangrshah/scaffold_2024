# Transparency

A comprehensive cookie consent manager made entirely for next.js v13+. 



## Prerequisites

> - Next.js v13.6+
> - TailwindCSS
> - Radx-UI / Slot



## How to use

1. Install the Transparency CookieConsentProvider component 

   ```shell
   npm install transparency
   ```

2. Instantiate it in your root layout.tsx.

   ```tsx
   // app/layout.tsx
   import { ThemeProvider } from "@/components/theme-provider"; // prerequiste
   import { Toaster } from "sonner" // prerequiste
   
   import { TransparencyProvider } from "transpaency"
   import Banner from "../components/ui/transparency/banner";
   
   export default function RootLayout({
     children,
   }: Readonly<{
     children: React.ReactNode;
   }>) {
     return (
       <html lang="en" suppressHydrationWarning>
         <body className={GeistSans.className}>
            <ThemeProvider>
     	      {children}
   	        <TransparencyProvider
               enabled={true}
               consentCookie="app-consent"
               necessaryTags={[
                 "security_storage",
                 "functionality_storage",
                 // "personalization_storage",
               ]}
               analyticsTags={[
                 "ad_storage",
                 "analytics_storage",
                 "ad_personalization",
                 // "ad_user_data",
               ]}
               banner={Banner} 
               redact={tue}
               expiry={60 * 60 * 24 * 7} // 1 week
             />
           </ThemeProvider>
         </body>
       </html>
     );
   }
   ```

   > See below  for [list of all props]()
   >
   > You can pass in a custom Banner component that has satisfies this [type Banner](), or you can install our customizable banner component, that is built with Shadcn/ui.



| Prop          | Type                       | Description                                                  | default                                                      |
| ------------- | -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| consentCookie | string                     | The name of the consent cookie. This will be used as the name of the cookie we store in the user's browser with thier selected consent tags and their associated consent status. |                                                              |
| necessaryTags | string[]                   | This is a typed string array with an enum of available strings:<br />  <br /> This is used to provide auto-complete for the recommended default tags related to user personalization and application functionality. | ['`functionality_storage`', '`personalization_storage`', '`security_storage`'] |
| analyticsTags | string[]                   | This is a typed string array with an enum of available string: <br />  <br />  This is used to provide auto-complete for the additonal default tags available related to user engagement tracking, analytics, and ads. | ['`ad_storage`', '`analytics_storage`', '`ad_personalization`', '`ad_user_data`'] |
| enabled       | boolean                    | Allows disabling the insertion of the gtag script            | true                                                         |
| expiry        | number                     | The default expiry that will be set along with the consent request. See more about [cookie consent expiration practices](). | 60 * 60 * 24 * 7 (1week)                                     |
| redact        | boolean                    | used to anonomize default google tag manager data before sending it across the wire. | true                                                         |
| dataLayername | string                     | Name of the [dataLayer]() object on the broser window.       | '`dataLayer`'                                                |
| gtag          | string                     | Name of the [gtag]() function on the window object           | 'gtag'                                                       |
| banner        | ComponentType<BannerProps> | The banner component to be display when user has not initiated consent. | Slot - radix-ui slot component                               |





> ## Prerequesites
>
> - Shadcn/ui
>   - Button
>   - Accordion
>   - Popover
>   - Sonner
>   - Switch