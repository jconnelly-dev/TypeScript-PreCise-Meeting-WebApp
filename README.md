<a name="readme-top"></a>


<!-- PROJECT SHIELDS -->
<p align="center">
  <a href="https://github.com/your-org/your-repo/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/your-org/your-repo.svg?style=for-the-badge" alt="Contributors">
  </a>
  <a href="https://github.com/your-org/your-repo/stargazers">
    <img src="https://img.shields.io/github/stars/your-org/your-repo.svg?style=for-the-badge" alt="Stargazers">
  </a>
  <a href="https://github.com/your-org/your-repo/issues">
    <img src="https://img.shields.io/github/issues/your-org/your-repo.svg?style=for-the-badge" alt="Issues">
  </a>
  <a href="https://github.com/your-org/your-repo/blob/main/LICENSE.txt">
    <img src="https://img.shields.io/github/license/your-org/your-repo.svg?style=for-the-badge" alt="License">
  </a>
</p>



# PreCiseMRM Meeting WebApp SPA

A minimalist Single Page Application using ASP.NET Core 9 as a static file host, with TypeScript for frontend logic.



## 📦 Docker
```bash
docker build -t typescript-meeting-webapp .
docker run -p 8080:8080 typescript-meeting-webapp
```
Access: [http://localhost:8080](http://localhost:8080)


## 🚀 Run Locally
```bash
npm install -g typescript
npm install
dotnet build
```
Access: [http://localhost:5000](http://localhost:5000)


## 🚢 Deploy to Heroku
```bash
heroku container:login
heroku create precise-meeting-spa

docker tag typescript-meeting-webapp registry.heroku.com/precise-meeting-spa/web
docker push registry.heroku.com/precise-meeting-spa/web
heroku container:release web -a precise-meeting-spa
heroku open -a precise-meeting-spa
```
Access: [http://precisemrm-meeting-app](https://precisemrm-meeting-app-ccd209b1d4ae.herokuapp.com/)


## 📁 Project Structure
```
Solution/
├── TypeScript-Meeting-WebApp.sln
├── TypeScript-Meeting-WebApp.csproj
├── Program.cs
├── Dockerfile
├── tsconfig.json
├── .gitignore
├── README.md
├── frontend/
│   └── main.ts
└── wwwroot/
    ├── index.html
    ├── styles.css
    └── dist/main.js (compiled)
```


## License

Distributed under the Apache License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Contact

**Joseph Connelly** 

You can reach me via:
- [Email](mailto:joseph_a_connelly@yahoo.com)
- [LinkedIn](https://www.linkedin.com/in/joseph-a-connelly)
- [GitHub](https://github.com/jconnelly-dev)

![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
<br />

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
[.Net]: https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white
[C#]: https://img.shields.io/badge/c%23-%23239120.svg?style=for-the-badge&logo=csharp&logoColor=white
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[JavaScript]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[HTML5]: https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white
[CSS3]: https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white
[Heroku]: https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white
[PowerShell]: https://img.shields.io/badge/PowerShell-5391FE?style=for-the-badge&logo=powershell&logoColor=white
[Visual Studio]: https://img.shields.io/badge/Visual%20Studio-5C2D91.svg?style=for-the-badge&logo=visual-studio&logoColor=white
[Markdown]: https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white