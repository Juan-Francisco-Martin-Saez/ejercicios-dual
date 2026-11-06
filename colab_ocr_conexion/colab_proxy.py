import os, time, io
from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException
from fastapi.responses import JSONResponse
import httpx
app = FastAPI(title="Colab OCR bridge")
TOKEN=os.environ["OCR_API_KEY"]
BACKEND=os.environ.get("OCR_BACKEND_URL", "").rstrip("/")
BACKEND_TOKEN=os.environ.get("OCR_BACKEND_API_KEY", "")
def auth(authorization):
    import secrets
    if not secrets.compare_digest(authorization or "", "Bearer " + TOKEN):
        raise HTTPException(401, "Unauthorized")
@app.get("/ready")
async def ready(authorization: str | None = Header(None)):
    auth(authorization)
    if not BACKEND:
        return JSONResponse({"ready":False,"error":"OCR_BACKEND_URL no configurada: el motor original no está incluido"}, status_code=503)
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            r=await client.get(BACKEND+"/ready",headers={"Authorization":"Bearer "+BACKEND_TOKEN})
        return JSONResponse(r.json(),status_code=r.status_code)
    except Exception as e:
        raise HTTPException(502, "Backend no accesible: "+str(e))
@app.post("/ocr")
async def ocr(file:UploadFile=File(...),dpi:int=Form(200),crop_mode:str=Form("true"),tokens_per_page:int=Form(4000),authorization:str|None=Header(None)):
    auth(authorization)
    if not BACKEND: raise HTTPException(503,"OCR_BACKEND_URL no configurada")
    content=await file.read()
    if len(content)>30*1024*1024: raise HTTPException(413,"Máximo 30 MB")
    try:
        async with httpx.AsyncClient(timeout=900) as client:
            r=await client.post(BACKEND+"/ocr",headers={"Authorization":"Bearer "+BACKEND_TOKEN},files={"file":(file.filename,content,file.content_type or "application/octet-stream")},data={"dpi":str(dpi),"crop_mode":crop_mode,"tokens_per_page":str(tokens_per_page)})
        return JSONResponse(r.json(),status_code=r.status_code)
    except Exception as e:
        raise HTTPException(502,"Error al llamar al motor: "+str(e))
