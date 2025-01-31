window.function = async function(api_key, thread_id, run_id, tool_outputs) {
    // Validate API Key
    if (!api_key.value) {
        return "Error: OpenAI API Key is required.";
    }

    // Validate Thread ID
    if (!thread_id.value) {
        return "Error: Thread ID is required.";
    }

    // Validate Run ID
    if (!run_id.value) {
        return "Error: Run ID is required.";
    }

    // Validate Tool Outputs
    let toolOutputsValue;
    if (tool_outputs.value) {
        try {
            toolOutputsValue = JSON.parse(tool_outputs.value);
            if (!Array.isArray(toolOutputsValue)) {
                return "Error: Tool Outputs should be an array of objects.";
            }
        } catch (e) {
            return "Error: Invalid JSON format for tool_outputs.";
        }
    } else {
        return "Error: Tool Outputs are required.";
    }

    // Construct request payload
    const payload = {
        tool_outputs: toolOutputsValue
    };

    // API endpoint URL
    const apiUrl = `https://api.openai.com/v1/threads/${thread_id.value}/runs/${run_id.value}/submit_tool_outputs`;

    // Make API request
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key.value}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return `Error ${response.status}: ${errorData.error?.message || "Unknown error"}`;
        }

        // Parse and return response
        const responseData = await response.json();
        return JSON.stringify(responseData, null, 2);

    } catch (error) {
        return `Error: Request failed - ${error.message}`;
    }
};
