# Claude Code Adapter

Este adaptador define cómo Claude Code debe importar las directrices de SEOS.

## Configuración

Claude Code busca reglas del sistema en el archivo `.claudecode/rules` o a través de instrucciones directas.

Para aplicar SEOS en Claude Code:

1. Crea o modifica el archivo `.claudecode/rules` en tu proyecto.
2. Agrega una regla para leer `skills/seos/SKILL.md` al inicio de cada conversación.
