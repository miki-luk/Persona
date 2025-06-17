// --- START OF FILE server/error/ApiError.js ---

class ApiError extends Error{
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }

    static badRequest(message) {
        // --- ↓↓↓ ИСПРАВЛЕНО С 404 НА 400 ↓↓↓ ---
        return new ApiError(400, message)
    }

    static internal(message) {
        return new ApiError(500, message)
    }

    static forbidden(message) {
        return new ApiError(403, message)
    }
}

module.exports = ApiError
// --- END OF FILE server/error/ApiError.js ---