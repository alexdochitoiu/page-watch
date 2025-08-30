import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WatcherRule, Operation } from "@/types/watcher";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface RulesDisplayProps {
  rules: WatcherRule[];
  results?: Array<{
    ruleId: string;
    passed: boolean;
    actualValue?: string;
    expectedValue?: string;
    error?: string;
  }>;
  compact?: boolean;
}

const operationLabels = {
  [Operation.EQUALS]: "equals",
  [Operation.CONTAINS]: "contains",
  [Operation.GREATER_THAN]: "greater than",
  [Operation.LESS_THAN]: "less than",
  [Operation.ELEMENT_EXISTS]: "element exists",
  [Operation.REGEX_MATCH]: "matches regex",
};

export const RulesDisplay: React.FC<RulesDisplayProps> = ({
  rules,
  results,
  compact = false
}) => {
  const getResultForRule = (ruleId: string) => {
    return results?.find(result => result.ruleId === ruleId);
  };

  const getResultIcon = (result: any) => {
    if (!result) return null;
    if (result.error) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return result.passed ?
      <CheckCircle className="h-4 w-4 text-green-500" /> :
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getResultColor = (result: any) => {
    if (!result) return "secondary";
    if (result.error) return "yellow";
    return result.passed ? "green" : "destructive";
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          Rules ({rules.length})
        </div>
        <div className="flex flex-wrap gap-1">
          {rules.map((rule, index) => {
            const result = getResultForRule(rule.id);
            return (
              <Badge
                key={rule.id}
                variant={getResultColor(result)}
                className="text-xs flex items-center gap-1"
              >
                {getResultIcon(result)}
                {rule.not && "NOT "}
                {rule.selector} {operationLabels[rule.operation]}
                {rule.value && ` "${rule.value}"`}
                {index < rules.length - 1 && rule.logicOperator && (
                  <span className="ml-1 font-bold">
                    {rule.logicOperator.toUpperCase()}
                  </span>
                )}
              </Badge>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Monitoring Rules</div>
      {rules.map((rule, index) => {
        const result = getResultForRule(rule.id);
        return (
          <Card key={rule.id} className="p-3">
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {index > 0 && rule.logicOperator && (
                    <Badge variant="outline" className="text-xs">
                      {rule.logicOperator.toUpperCase()}
                    </Badge>
                  )}
                  {getResultIcon(result)}
                </div>
                <Badge variant={getResultColor(result)} className="text-xs">
                  {result?.error ? "Error" : result?.passed ? "Passed" : result ? "Failed" : "Not tested"}
                </Badge>
              </div>

              <div className="text-sm">
                <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                  {rule.selector}
                </span>
                <span className="mx-2">
                  {rule.not && <span className="text-red-600 font-semibold">NOT </span>}
                  {operationLabels[rule.operation]}
                </span>
                {rule.value && (
                  <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                    "{rule.value}"
                  </span>
                )}
              </div>

              {result && (
                <div className="text-xs text-muted-foreground space-y-1">
                  {result.error && (
                    <div className="text-red-600">Error: {result.error}</div>
                  )}
                  {result.actualValue && (
                    <div>
                      <span className="font-medium">Actual:</span> {result.actualValue}
                    </div>
                  )}
                  {result.expectedValue && (
                    <div>
                      <span className="font-medium">Expected:</span> {result.expectedValue}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
