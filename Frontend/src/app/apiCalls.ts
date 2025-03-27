import api from '@/app/api';
export const createServer = async (serverName: string, serverImage: File, profileId: string) => {
    try {
        const formData = new FormData();
        formData.append('serverName', serverName);
        formData.append('serverImage', serverImage);
        formData.append('profileId', profileId);

        const response = await api.post('servers/createServer', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating server:', error);
        throw error;
    }
};

export const joinServer = async (inviteCode: string, profileId: string) => {
    try {
        const response = await api.post('/servers/joinServer', { inviteCode, profileId });
        return response.data.data;
    } catch (error) {
        console.error('Error in joinServer:', error);
        throw error;
    }
};

export const getProfilesByServerId = async (serverId: string) => {
    try {
        const response = await api.post('/profiles/getProfilesByServerId', { serverId });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
};

export const changeRoleToGuest = async (memberId: string) => {
    try {
        const response = await api.post('/members/changeRoleToGuest', { memberId });
        return response.data;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
}

export const changeRoleToModerator = async (memberId: string) => {
    try {
        const response = await api.post('/members/changeRoleToModerator', { memberId });
        return response.data;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
}

export const kickOutMember = async (memberId: string, profileId: string, serverId: string) => {
    try {
        const response = await api.post('/members/kickOutMember', { memberId, profileId, serverId });
        return response.data;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
}

export const createChannel = async (channelName: string, channelType: string, profileId: string, serverId: string,) => {
    try {
        const response = await api.post('/channels/createChannel', { channelName, channelType, profileId, serverId, });
        return response.data;
    } catch (error) {
        console.error('Error fetching profiles:', error);
    }
}

export const leaveServer = async (profileId: string, serverId: string) => {
    try {
        const response = await api.post('/servers/leaveServer', { profileId, serverId });
        return response.data;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
}

export const deleteChannel = async (channelId: string, serverId: string) => {
    try {
        const response = await api.post('/channels/deleteChannel', { channelId, serverId });
        return response.data;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
}
export const fetchConversation = async (currentUserMemberId: string, targetUserMemberId: string) => {
    try {
        const response = await api.post('/conversations/fetchConversation', { currentUserMemberId, targetUserMemberId });
        console.log(response.data.data);

        return response.data.data;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
}

export const getProfileById = async (profileId: string) => {
    try {
        const response = await api.post('/profiles/getProfileById', { profileId });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
}

export const createLivekitVideoToken = async (roomName: string, participantName: string) => {
    try {
        const response = await api.post('/video/createLivekitVideoToken', { roomName, participantName })
        return response.data.data;

    } catch (error) {
        console.error('Error fetching Livekit Video Token:', error);
        throw error;
    }
}

export const fetchAllFilesFromDB = async () => {
    try {
        const response = await api.get('/gpt/fetchAllFilesFromDB');
        // console.log(response);
        return response.data.data;
    } catch (error) {
        console.error('Error in fetching files from db', error);
        throw error;
    }
}

export const getFileCreateEmbeddingStoreInPinecone = async (filePath: string, fileName: string) => {
    try {
        const response = await api.post('/gpt/getFileCreateEmbeddingStoreInPinecone', { filePath, fileName })
        return response.data.data;
        // console.log("File Path:",filePath);
        // console.log("File Name:",fileName);

    } catch (error) {
        console.error('Error occured while embedding and saving files to pinecone', error);
        throw error;
    }
}

export const fetchLLMResponse = async (query: string, similarChunks: string[]) => {
    try {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

        if (!apiKey) {
            console.error("API key is missing.");
            return 'An error occurred while fetching the response.';
        }
        // console.log(apiKey);
        
        // Construct the prompt by combining the user's query with similar chunks
        const prompt = `
        Context:
        ${similarChunks.join('\n\n')}
        
        User's Question:
        ${query}`;

        // Send the request to the OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`, // Your OpenAI API key
            },
            body: JSON.stringify({
                model: 'gpt-4', // Specify the model you want to use
                messages: [{ role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt }],
                max_tokens: 150, // Adjust the token limit based on your requirements
                temperature: 0.7, // Adjust the creativity level of the response
            }),
        });

        // Parse the response data
        const data = await response.json();

        // Extract the assistant's response from the data
        const assistantMessage = data.choices[0].message.content.trim();

        // Return the assistant's response
        return assistantMessage;

    } catch (error) {
        console.error('Error fetching LLM response:', error);
        return 'An error occurred while fetching the response.';
    }
    // console.log(similarChunks);

};

export const fetchSimilarChunkFromPinecone = async (query: string, fileName: string) => {
    try {
        const response = await api.post(`/gpt/fetchSimilarChunkFromPinecone`, { query, fileName });
        return response.data.data;
    } catch (error) {
        console.error('Error occured while fetching similar chunks', error);
        throw error;
    }
}