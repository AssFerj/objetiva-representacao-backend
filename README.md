# Objetiva Representação Backend

Backend para o sistema de gerenciamento de recibos da Objetiva Representação.

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Preencha as variáveis com suas credenciais

3. Inicie o servidor:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Endpoints

### POST /api/upload
Upload de arquivos para o Google Drive.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - file: File
  - fileName: string
  - metadata: JSON string (opcional)

**Response:**
```json
{
  "webViewLink": "string"
}
```

### GET /health
Verifica o status do servidor.

**Response:**
```json
{
  "status": "ok"
}
```
