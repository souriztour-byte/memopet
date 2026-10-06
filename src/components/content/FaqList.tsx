import type { FaqItem } from "@/content/faq";

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.id} id={item.id}>
          <summary>{item.question}</summary>
          <div className="answer">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
