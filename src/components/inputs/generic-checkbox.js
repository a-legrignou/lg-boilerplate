import { TriangleAlert } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

export default function GenericCheckboxGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      {options.length > 0 ? (
        <div className="bg-background p-2 rounded border border-pearl">
          {options.map((opt) => {
            const checked = value.includes(opt.value);
            if (opt.label != "") {
              return (
                <div key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const newValue = isChecked ? [...value, opt.value] : value.filter((v) => v !== opt.value);
                      onChange(newValue);
                    }}
                    className="
                  w-4 h-4 rounded border border-border-md
                  data-[state=checked]:bg-t1
                  data-[state=checked]:border-t1
                  transition-all
                "
                  />
                  <span className="text-sm">{opt.label}</span>
                </div>
              );
            }
          })}
        </div>
      ) : (
        <div className="text-red-700 text-sm flex flex-row items-center p-1 border border-red-700 rounded">
          <TriangleAlert className="mr-2" /> <div>Aucune donnée disponible</div>
        </div>
      )}
    </div>
  );
}
