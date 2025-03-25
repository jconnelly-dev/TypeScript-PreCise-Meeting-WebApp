# Hello World SPA (.NET 9 + HTML/CSS/TypeScript)

A minimalist Single Page Application using ASP.NET Core 9 as a static file host, with TypeScript for frontend logic and no Razor/Blazor.

## 🚀 Run Locally
```bash
npm install -g typescript
npm install
dotnet build
```
Access: [http://localhost:5000](http://localhost:5000)

## 📦 Docker
```bash
docker build -t helloworld-spa .
docker run -p 8080:8080 helloworld-spa
```

## 🚢 Deploy to Heroku
```bash
heroku container:login
heroku create your-app-name

docker tag helloworld-spa registry.heroku.com/your-app-name/web
docker push registry.heroku.com/your-app-name/web
heroku container:release web -a your-app-name
heroku open -a your-app-name
```

## 📁 Project Structure
```
HelloWorldSpa/
├── HelloWorldSpa.sln
├── HelloWorldSpa.csproj
├── Program.cs
├── Dockerfile
├── tsconfig.json
├── .gitignore
├── README.md
├── src/
│   └── main.ts
└── wwwroot/
    ├── index.html
    ├── styles.css
    └── dist/main.js (compiled)
```