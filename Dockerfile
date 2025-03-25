# This stage is used to run the project
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

# This stage is used build the project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Install Node.js, TypeScript, and esbuild globally
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g typescript esbuild

# Copy everything for proper restore, restore dependencies, then build the project
COPY . .
RUN dotnet restore
RUN dotnet build "./TypeScript-Meeting-WebApp.csproj" -c ${BUILD_CONFIGURATION:-Release} -o /app/build

# This stage is used to publish the project and copy to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./TypeScript-Meeting-WebApp.csproj" -c ${BUILD_CONFIGURATION:-Release} -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app

# Copy published output
COPY --from=publish /app/publish .

# Ensure correct URL binding for ASP.NET Core inside Docker
ENV ASPNETCORE_URLS=http://+:8080

# Run the application
ENTRYPOINT ["dotnet", "TypeScript-Meeting-WebApp.dll"]