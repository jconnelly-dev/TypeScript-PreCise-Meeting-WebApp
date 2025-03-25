# --- Base image for running the app ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

# --- Build stage ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
COPY package*.json ./
RUN npm install
COPY . .
RUN dotnet restore
RUN dotnet build "./TypeScript-Meeting-WebApp.csproj" -c ${BUILD_CONFIGURATION:-Release} -o /app/build

# --- Publish stage ---
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./TypeScript-Meeting-WebApp.csproj" -c ${BUILD_CONFIGURATION:-Release} -o /app/publish /p:UseAppHost=false

# --- Final runtime image ---
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "TypeScript-Meeting-WebApp.dll"]