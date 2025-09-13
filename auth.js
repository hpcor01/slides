<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Slides</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">

  <style>
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #f8f9fa;
    }
    .login-card {
      width: 100%;
      max-width: 380px;
      padding: 2rem;
      border-radius: 1rem;
      background: #fff;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    .form-control:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.2rem rgba(13,110,253,0.25);
    }
    .btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .5rem;
    }
  </style>
</head>
<body>

  <div class="login-card">
    <h3 class="text-center mb-4">Acesso ao Sistema</h3>
    <form id="loginForm">
      <div class="mb-3 input-group">
        <span class="input-group-text"><i class="bi bi-person"></i></span>
        <input type="text" id="username" class="form-control" placeholder="Usuário" required>
      </div>
      <div class="mb-3 input-group">
        <span class="input-group-text"><i class="bi bi-lock"></i></span>
        <input type="password" id="password" class="form-control" placeholder="Senha" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">
        <i class="bi bi-box-arrow-in-right"></i> Entrar
      </button>
      <div id="errorMsg" class="text-danger text-center mt-3" style="display:none;">
        Usuário ou senha inválidos
      </div>
    </form>
  </div>

  <script>
    document.getElementById("loginForm").addEventListener("submit", async function(e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        if (res.ok) {
          window.location.href = "/admin.html";
        } else {
          document.getElementById("errorMsg").style.display = "block";
        }
      } catch (err) {
        console.error("Erro na requisição:", err);
        document.getElementById("errorMsg").style.display = "block";
      }
    });
  </script>

</body>
</html>
