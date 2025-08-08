import { Plus, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Operation, WatcherRule } from "@/types/watcher";

const operationOptions = [
  { value: Operation.EQUALS, label: "Equals" },
  { value: Operation.CONTAINS, label: "Contains" },
  { value: Operation.GREATER_THAN, label: "Greater Than" },
  { value: Operation.LESS_THAN, label: "Less Than" },
  { value: Operation.ELEMENT_EXISTS, label: "Element Exists" },
  { value: Operation.REGEX_MATCH, label: "Regex Match" },
];

interface RulesBuilderProps {
  rules: WatcherRule[];
  onChange: (rules: WatcherRule[]) => void;
}

export const RulesBuilder: React.FC<RulesBuilderProps> = ({ rules, onChange }) => {
  const addRule = () => {
    const newRule: WatcherRule = {
      id: Date.now().toString(),
      selector: "",
      value: "",
      operation: Operation.EQUALS,
      not: false,
      logicOperator: rules.length > 0 ? "and" : undefined,
    };
    onChange([...rules, newRule]);
  };

  const updateRule = (index: number, updates: Partial<WatcherRule>) => {
    const updatedRules = rules.map((rule, i) => (i === index ? { ...rule, ...updates } : rule));
    onChange(updatedRules);
  };

  const removeRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    if (updatedRules.length > 0 && updatedRules[0].logicOperator) {
      updatedRules[0] = { ...updatedRules[0], logicOperator: undefined };
    }
    onChange(updatedRules);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Monitoring rules</Label>
        <Button type="button" onClick={addRule} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add rule
        </Button>
      </div>

      {rules.map((rule, index) => (
        <Card key={rule.id} className="p-4">
          <CardContent className="space-y-4 p-0">
            <div className="flex items-center justify-between mb-2">
              {index > 0 ? (
                <div className="flex items-center space-x-2">
                  <Select
                    value={rule.logicOperator ?? "and"}
                    onValueChange={value =>
                      updateRule(index, {
                        logicOperator: value as WatcherRule["logicOperator"],
                      })
                    }
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="and">AND</SelectItem>
                      <SelectItem value="or">OR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div />
              )}
              <Button type="button" variant="outline" size="sm" onClick={() => removeRule(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">CSS Selector</Label>
                <Input
                  placeholder="e.g., .price, #status"
                  value={rule.selector}
                  onChange={e => updateRule(index, { selector: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col items-center justify-center">
                  <Label className="text-xs text-muted-foreground">NOT</Label>
                  <div className="flex items-center mt-1">
                    <Checkbox
                      className="h-8 w-8"
                      checked={rule.not}
                      onCheckedChange={checked => updateRule(index, { not: !!checked })}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Operation</Label>
                  <Select
                    value={rule.operation}
                    onValueChange={value =>
                      updateRule(index, {
                        operation: value as WatcherRule["operation"],
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {rule.operation !== Operation.ELEMENT_EXISTS && (
                  <div>
                    <Label className="text-xs text-muted-foreground white">Expected Value</Label>
                    <Input
                      placeholder="100"
                      value={rule.value}
                      onChange={e => updateRule(index, { value: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {rules.length === 0 && (
        <div className="text-center py-2 text-muted-foreground">
          <p className="text-sm">
            No rules defined. Click <b>+ Add rule</b> to start monitoring specific elements.
          </p>
        </div>
      )}
    </div>
  );
};
