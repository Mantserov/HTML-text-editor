import axios from "axios";
import { IText } from "./types";

class TextService {
  private URL =
    "https://json-server-test-1iv2s6tcj-mantserovs-projects.vercel.app/texts";

  async getTexts() {
    const response = await axios.get<IText[]>(this.URL);
    return response.data;
  }

  async sendText(text: string) {
    const response = await axios.post<IText[]>(this.URL, {
      text,
    });
    return response.data;
  }

  async deleteText(id: number) {
    const response = await axios.delete(`${this.URL}/${id}`);
    return response.data;
  }
}

export const textService = new TextService();
