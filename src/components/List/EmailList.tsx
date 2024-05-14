import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { textService } from "../../services/text.service";
import parse from "html-react-parser";

export function EmailList() {
  const { data } = useQuery({
    queryKey: ["text list"],
    queryFn: () => textService.getTexts(),
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["create text"],
    mutationFn: () => textService.sendText(text),
    onSuccess() {
      setText("");
      queryClient.refetchQueries();
    },
  });

  return (
    <div className="saved">
      <ul className="saved__list">
        {data?.map((text) => (
          <li key={text.id}>{parse(text.text)}</li>
        ))}
      </ul>
    </div>
  );
}
