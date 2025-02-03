# Booking Microfrontend

This directory contains the booking microfrontend application, which is responsible for managing bookings within the overall microfrontend architecture. 

## Structure

- **src/**: Contains the source code for the booking application.
  - **components/**: Reusable components specific to the booking functionality.
    - `BookingForm.tsx`: Component for handling booking form submissions.
    - `BookingList.tsx`: Component for displaying a list of bookings.
  - **pages/**: Contains the main pages for the booking application.
    - `BookingHome.tsx`: Main page for booking management.
    - `BookingDetails.tsx`: Page for showing details of a specific booking.
  - `main.tsx`: Entry point for the booking application, setting up routing and rendering the main component.
  - `App.ts`: Defines the application module, importing necessary components and setting up the application structure.

## Getting Started

To get started with the booking microfrontend, follow these steps:

1. **Install Dependencies**: Run `pnpm install` in the booking directory to install the necessary dependencies.
2. **Run the Application**: Use `pnpm start` to launch the booking application in development mode.
3. **Build for Production**: Use `pnpm run build` to create an optimized build for production.

## Contributing

Contributions are welcome! Please follow the standard practices for contributing to open-source projects, including forking the repository and submitting pull requests.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.