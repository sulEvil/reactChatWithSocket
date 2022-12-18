import {existsSync, mkdirSync } from 'fs'
import multer from 'multer'
import {dirname, join} from 'path'
import {fileURLToPath} from "url"

// путь к текущей директории

const _dirname = dirname(fileURLToPath(import.meta.url))

const upload = multer({
    storage: multer.diskStorage({
        // директория для записи файлов
        destination: async (req, _, cb) => {
            // извлекаем идентификатор комнаты из http-заголовка 'X-room-Id'
            const roomId = req.headers['x-room-id']
            // файлы хранятся по комнатам
            // название директории - идентификатор комнаты

            // создаем директорию при отсутствии
            if(!existsSync(dirPath)){
                mkdirSync(dirPath, {recursive: true})
            }
            cb(null, dirPath)
        },
        fileName: (_, file, cb) => {
            // названия файлом могут быть одинаковыми
            // добавляем к названию время
            const fileName = `${Date.now()}-${file.originalname}`
            cb(null, fileName)
        }
    })
})
export default upload