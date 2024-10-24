import ExtractJsons from './services/fnJsonToExcel.js';
import { app } from "@azure/functions";

app.http('JsonToExcel', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const json = request.query.get('json') || (await request.json());

            // Validar que el JSON tenga la propiedad B64File
            if (!json.B64File) {
                return { status: 400, jsonBody: { error: "Falta la propiedad B64File en el JSON" } };
            }

            const respuesta = await ExtractJsons(json);

            if (!respuesta) {
                return { status: 400, jsonBody: { error: "Error al extraer datos de la columna D" } };
            } else {
                // Asegurarte de que la respuesta es un JSON correctamente formateado
                return { status: 200, jsonBody: respuesta };
            }
        } catch (error) {
            console.error("Error en el endpoint JsonToExcel:", error);
            return { status: 500, jsonBody: { error: "Error interno del servidor" } };
        }
    }
});

export default app;