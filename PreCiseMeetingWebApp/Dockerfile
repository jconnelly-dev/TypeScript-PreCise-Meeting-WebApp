# Use the official .NET SDK image for the build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Install Node.js v18, TypeScript, and esbuild globally in the build stage
RUN apt-get update && apt-get install -y curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g typescript esbuild \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory for build stage
WORKDIR /src

# Copy the .csproj file and restore dependencies
COPY ["PreCiseMeetingWebApp.csproj", "."]
RUN dotnet restore "./PreCiseMeetingWebApp.csproj"

# Copy the rest of the application code
COPY . . 

# Copy the package.json and package-lock.json from one directory above
COPY ../package*.json .

# Install npm dependencies (including esbuild) in the working directory
RUN npm install

# Run the build process
RUN dotnet build "./PreCiseMeetingWebApp.csproj" -c Release -o /app/build

# Publish the app (optional, but recommended for a production build)
RUN dotnet publish "./PreCiseMeetingWebApp.csproj" -c Release -o /app/publish

# Use the official .NET runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

# Set up the working directory and expose port 8080
WORKDIR /app
EXPOSE 8080

# Copy the published output from the build stage
COPY --from=build /app/publish .

# Set the entry point for the container
ENTRYPOINT ["dotnet", "PreCiseMeetingWebApp.dll"]
