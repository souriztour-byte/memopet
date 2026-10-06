import { getI18n } from "@/i18n/server";

/** The prototype's three "How to order" steps, rewritten for the live store. */
export async function OrderSteps() {
  const { dict } = await getI18n();
  const t = dict.orderSteps;
  return (
    <ol className="how">
      <li className="step">
        <h3>{t.step1Title}</h3>
        <p>{t.step1Text}</p>
      </li>
      <li className="step">
        <h3>{t.step2Title}</h3>
        <p>{t.step2Text}</p>
      </li>
      <li className="step">
        <h3>{t.step3Title}</h3>
        <p>{t.step3Text}</p>
      </li>
    </ol>
  );
}
