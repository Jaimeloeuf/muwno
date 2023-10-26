import { sf } from "simpler-fetch";
import { getAuthHeader } from "../firebase";
import type { ProductID, ReadManyTaskDTO, TaskID } from "@domain-model";

export class TaskController {
  static async getTasks(productID: ProductID, count: number) {
    const { res, err } = await sf
      .useDefault()
      .GET(`/task/of-product/${productID}?count=${count}`)
      .useHeader(getAuthHeader)
      .runJSON<ReadManyTaskDTO>();

    if (err) throw err;
    if (!res.ok) throw new Error(`Failed to get Tasks: ${JSON.stringify(res)}`);

    return res.data.tasks;
  }

  static async markTaskAsDone(taskID: TaskID) {
    const { res, err } = await sf
      .useDefault()
      .POST(`/task/done/${taskID}`)
      .useHeader(getAuthHeader)
      .runVoid((res) => res.json());

    if (err) throw err;
    if (!res.ok)
      throw new Error(`Failed to mark Task as done: ${JSON.stringify(res)}`);
  }
}
